import { useGlobalStore } from "../../store/GlobalStore.tsx";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "../ErrorPage.tsx";
import ServerList from "./ServerList.tsx";
import ServerIndex from "./serverIndex/ServerIndex.tsx";
import ServerChat from "./serverChat/ServerChat.tsx";
import useFetchServerList from "../../hook/server/useFetchServerList.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import ServerAddModal from "./ServerAddModal.tsx";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { Client, IMessage } from "@stomp/stompjs";
import { useEnvStore } from "../../store/EnvStore.tsx";
import { useStompStore } from "../../store/StompStore.tsx";
import useCheckPath from "../../hook/useCheckPath.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import ServerInviteModal from "./serverChat/serverChatDropdown/ServerInviteModal.tsx";
import useReceiveStompMessageHandler from "../../hook/useReceiveStompMessageHandler.tsx";

export default function Server() {
  const { receiveStompMessageHandler } = useReceiveStompMessageHandler();
  const { fetchServerList } = useFetchServerList();
  const { checkPath } = useCheckPath();

  const { userState } = useUserStore();
  const { serverAddState } = useServerAddStore();
  const { serverState } = useServerStore();
  const { envState } = useEnvStore();
  const { stompState, setStompState } = useStompStore();
  const { globalState } = useGlobalStore();

  const routePathList = ["", ":serverId"];

  const subscribeToServer = async (stompClient: Client) => {
    const serverList = await fetchServerList();
    for (const server of serverList) {
      const subscriptionUrl = `/sub/server/${server.id}`;
      stompClient.subscribe(subscriptionUrl, (message: IMessage) => {
        const receiveMessage = JSON.parse(message.body);
        setStompState({ chatMessage: receiveMessage });
      });
    }
  };

  useEffect(() => {
    checkPath({ routePathList: routePathList });

    const stompUrl = envState.stompUrl;
    const stompClient = new Client({
      brokerURL: stompUrl,
      onConnect: () => {
        subscribeToServer(stompClient);
      },
      onStompError: (frame) => {
        console.error("Stomp Error" + frame.body);
      },
    });
    stompClient.activate();

    return () => {
      void stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    if (stompState.chatMessage)
      receiveStompMessageHandler(stompState.chatMessage);
  }, [stompState.chatMessage]);

  useEffect(() => {
    if (userState.username) {
      fetchServerList();
    }
  }, [userState.username]);

  const renderPage = () => {
    if (globalState.pageInvalid) {
      return <ErrorPage />;
    }

    if (!userState.login) {
      return <ErrorPage />;
    }

    return (
      <div className={"flex h-full w-full text-white"}>
        <div className={"w-20"}>
          <ServerList />
        </div>
        <div className={"w-full"}>
          <Routes>
            <Route index element={<ServerIndex />} />
            <Route path={":serverId"} element={<ServerChat />} />
          </Routes>
        </div>

        {serverAddState.open ? <ServerAddModal /> : null}
        {serverState.inviteModalOpen ? <ServerInviteModal /> : null}
      </div>
    );
  };

  return renderPage();
}
