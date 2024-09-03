import { useGlobalStore } from "../../store/GlobalStore.tsx";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
import ErrorPage from "../ErrorPage.tsx";
import useFetchChatList from "../../hook/server/serverChat/useFetchChatList.tsx";
import { ServerInfo } from "../../../index";
import useFetchServerUserList from "../../hook/server/useFetchServerUserList.tsx";
import useFetchFriendList from "../../hook/user/useFetchFriendList.tsx";
import useFetchFriendWaitingList from "../../hook/user/useFetchFriendWaitingList.tsx";

export default function Server() {
  const { receiveStompMessageHandler } = useReceiveStompMessageHandler();
  const { fetchServerList } = useFetchServerList();
  const { fetchFriendList } = useFetchFriendList();
  const { fetchFriendWaitingList } = useFetchFriendWaitingList();
  const { fetchServerUserList } = useFetchServerUserList();
  const { checkPath } = useCheckPath();
  const { fetchChatList } = useFetchChatList();

  const { userState } = useUserStore();
  const { serverAddState } = useServerAddStore();
  const { serverState, setServerState, serverListState } = useServerStore();
  const { envState } = useEnvStore();
  const { stompState, setStompState } = useStompStore();
  const { globalState } = useGlobalStore();

  const location = useLocation();
  const serverId = Number(location.pathname.split("/").pop());

  const rootPath = "/server";
  const routePathList = ["/", "/:serverId"];

  const subscribeToServer = async (
    serverList: ServerInfo[],
    stompClient: Client,
  ) => {
    for (const server of serverList) {
      const subscriptionUrl = `/sub/server/${server.id}`;
      stompClient.subscribe(subscriptionUrl, (message: IMessage) => {
        const receiveMessage = JSON.parse(message.body);
        setStompState({ chatMessage: receiveMessage });
      });
    }
  };

  useEffect(() => {
    if (userState.username) {
      fetchServerList();
      fetchFriendList();
      fetchFriendWaitingList();
    }
  }, [userState.username]);

  useEffect(() => {
    checkPath({ rootPath, routePathList });

    if (serverId && userState.username) {
      const server = serverListState.find((server) => server.id === serverId);
      setServerState({ id: server?.id, name: server?.name });

      fetchChatList({ serverId: Number(serverId) });
      fetchServerUserList({ serverId: Number(serverId) });
    }

    const stompUrl = envState.stompUrl;
    const stompClient = new Client({
      brokerURL: stompUrl,
      onConnect: () => {
        subscribeToServer(serverListState, stompClient);
        const subscriptionUserUrl = `/sub/user/${userState.id}`;
        stompClient.subscribe(subscriptionUserUrl, (message: IMessage) => {
          const receiveMessage = JSON.parse(message.body);
          setStompState({ chatMessage: receiveMessage });
        });
      },
      onStompError: (frame) => {
        console.error("Stomp Error" + frame.body);
      },
    });
    stompClient.activate();

    return () => {
      void stompClient.deactivate();
    };
  }, [serverListState, location.pathname]);

  useEffect(() => {
    if (stompState.chatMessage)
      receiveStompMessageHandler(stompState.chatMessage);
  }, [stompState.chatMessage]);

  const renderPage = () => {
    if (globalState.pageInvalid) {
      return <ErrorPage />;
    }

    if (!userState.login && globalState.fetchProfile) {
      return <ErrorPage />;
    }

    return (
      <div className={"relative flex h-full w-full text-white"}>
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
