import { useGlobalStore } from "../../store/GlobalStore.tsx";
import { useEffect } from "react";
import { Route, Routes, useParams } from "react-router-dom";
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
import useFetchServerUserList from "../../hook/server/useFetchServerUserList.tsx";
import useFetchFriendList from "../../hook/user/useFetchFriendList.tsx";
import useFetchFriendWaitingList from "../../hook/user/useFetchFriendWaitingList.tsx";
import { useTokenStore } from "../../store/TokenStore.tsx";

let stompClient: Client | undefined = undefined;

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
  const { tokenState } = useTokenStore();
  const { globalState } = useGlobalStore();

  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const serverIdNumber = Number(serverId);
  const channelIdNumber = Number(channelId);

  const rootPath = "/server";
  const routePathList = ["/", "/:serverId", "/:serverId/:channelId"];

  // 로그인해서 userState.username 변경된 경우
  useEffect(() => {
    if (userState.username) {
      fetchServerList();
      fetchFriendList();
      fetchFriendWaitingList();
    }
  }, [userState.username]);

  // 경로 바뀔때, server list 가져왔을때, 경로검증 + serverState change
  useEffect(() => {
    checkPath({ rootPath, routePathList });
    if (serverId && userState.username) {
      const server = serverListState.find(
        (server) => server.id === serverIdNumber,
      );
      setServerState({ id: server?.id, name: server?.name });
    }
  }, [serverListState, location.pathname]);

  // server 바뀔때 fetch server chat, user list
  useEffect(() => {
    if (serverState.id) {
      fetchChatList({ serverId: serverState.id });
      fetchServerUserList({ serverId: serverState.id });
    }
  }, [serverState.id]);

  // stomp 연결
  const subscribeToUser = (stompClient: Client) => {
    const subscriptionUserUrl = `/sub/user/${userState.id}`;
    if (userState.id && stompClient) {
      stompClient.subscribe(
        subscriptionUserUrl,
        (message: IMessage) => {
          const receiveMessage = JSON.parse(message.body);
          setStompState({ chatMessage: receiveMessage });
        },
        {
          id: userState.id.toString(),
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      );
    }
  };

  const setStomp = () => {
    const stompUrl = envState.stompUrl;
    const stompClient = new Client({
      brokerURL: stompUrl,
      onConnect: () => {
        subscribeToUser(stompClient);
      },
      onStompError: (frame) => {
        console.error("Stomp Error" + frame.body);
      },
    });
    stompClient.activate();
  };
  useEffect(() => {
    setStomp();
    return () => {
      void stompClient.deactivate();
      if (stompClient) {
        stompClient.deactivate();
        stompClient = undefined;
      }
    };
  }, [serverListState, tokenState.accessToken]);

  // stomp 메시지 수신
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
            <Route path={":serverId/:channelId"} element={<ServerChat />} />
          </Routes>
        </div>

        {serverAddState.open ? <ServerAddModal /> : null}
        {serverState.inviteModalOpen ? <ServerInviteModal /> : null}
      </div>
    );
  };

  return renderPage();
}
