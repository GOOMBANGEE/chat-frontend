import { useGlobalStore } from "../../store/GlobalStore.tsx";
import { useEffect } from "react";
import { matchPath, Route, Routes } from "react-router-dom";
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

export default function Server() {
  const { fetchServerList } = useFetchServerList();

  const { userState } = useUserStore();
  const { serverAddState } = useServerAddStore();
  const { envState } = useEnvStore();
  const { setStompState } = useStompStore();
  const { globalState, setGlobalState } = useGlobalStore();

  const rootPath = "/";
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
    if (
      !routePathList.some((path) =>
        matchPath(rootPath + path, location.pathname),
      )
    ) {
      setGlobalState({ pageInvalid: true });
    }

    // todo
    // 메세지 갱신

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
    if (userState.username) {
      fetchServerList();
    }
  }, [userState.username]);

  const renderPage = () => {
    if (globalState.pageInvalid) {
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
      </div>
    );
  };

  return renderPage();
}
