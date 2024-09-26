import { useGlobalStore } from "../../store/GlobalStore.tsx";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ServerList from "./ServerList.tsx";
import ServerIndex from "./serverIndex/ServerIndex.tsx";
import ServerChat from "./serverChat/ServerChat.tsx";
import useFetchServerList from "../../hook/server/useFetchServerList.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import ServerAddModal from "./ServerAddModal.tsx";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { Client } from "@stomp/stompjs";
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
import { useChannelStore } from "../../store/ChannelStore.tsx";
import devLog from "../../devLog.ts";
import useStompSubscribe from "../../hook/useStompSubscribe.tsx";
import { useChatStore } from "../../store/ChatStore.tsx";

export default function Server() {
  const { stompSubscribe } = useStompSubscribe();
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
  const { channelState, setChannelState, channelListState } = useChannelStore();
  const { chatListState } = useChatStore();
  const { envState } = useEnvStore();
  const { stompState, setStompState } = useStompStore();
  const { tokenState } = useTokenStore();
  const { globalState } = useGlobalStore();

  const componentName = "Server";
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

  // server 바뀔때 fetch server chat, user list
  useEffect(() => {
    if (serverState.id && channelState.id) {
      // chatListState에 해당 serverId, channelId인 chatList가 있는지 확인
      const chatInfoExists = chatListState.some(
        (chatInfo) =>
          chatInfo.serverId === serverState.id &&
          chatInfo.channelId === channelState.id,
      );

      // chatList가 없는경우
      if (!chatInfoExists) {
        fetchChatList({ serverId: serverState.id, channelId: channelState.id });
      }
      fetchServerUserList({ serverId: serverState.id });
    }
  }, [serverState.id, channelState.id]);

  // 초기 stomp 연결
  const initializeStompClient = () => {
    if (!stompState.client) {
      const stompUrl = envState.stompUrl;
      const newStompClient = new Client({
        brokerURL: stompUrl,
        onConnect: () => {
          devLog(componentName, "setStompClient");
          setStompState({ client: newStompClient });
        },
        onStompError: (frame) => {
          console.error("Stomp Error: " + frame.body);
        },
      });
      newStompClient.activate();
    }
  };
  useEffect(() => {
    initializeStompClient();
    return () => {
      if (stompState.client) {
        stompState.client.deactivate();
        devLog(componentName, "setStompClient undefined");
        setStompState({ client: undefined });
      }
    };
  }, [tokenState.accessToken]);
  // stomp 메시지 수신
  useEffect(() => {
    if (stompState.chatMessage)
      receiveStompMessageHandler(stompState.chatMessage);
  }, [stompState.chatMessage]);

  // 새로고침, 경로변경시 -> server, channel 상태 저장 , stomp sub
  const serverId = Number(location.pathname.split("/")[2]);
  const channelId = Number(location.pathname.split("/")[3]);
  useEffect(() => {
    checkPath({ rootPath, routePathList });
    if (userState.username && serverId && channelId) {
      // subscribe user
      const userSubscriptionUrl = `/sub/user/${userState.id}`;
      stompSubscribe(userSubscriptionUrl);

      // subscribe server
      const server = serverListState.find((server) => server.id === serverId);
      if (server) {
        devLog(componentName, "setServerState");
        setServerState({ id: server.id, name: server.name });
        const serverSubscriptionUrl = `/sub/server/${server.id}`;
        stompSubscribe(serverSubscriptionUrl);
      }

      // subscribe channel
      const channel = channelListState.find(
        (channel) => channel.id === channelId,
      );
      if (server && channel) {
        devLog(componentName, "setChannelState");
        setChannelState({
          id: channel.id,
          name: channel.name,
          displayOrder: channel.displayOrder,
          lastReadMessageId: channel.lastReadMessageId
            ? channel.lastReadMessageId
            : undefined,
          lastMessageId: channel.lastMessageId
            ? channel.lastMessageId
            : undefined,
          serverId: channel.serverId,
          categoryId: channel.categoryId ? channel.categoryId : undefined,
        });
        const channelSubscriptionUrl = `/sub/channel/${server.id}/${channel.id}`;
        stompSubscribe(channelSubscriptionUrl);
      }
    }
  }, [serverListState, channelListState, location.pathname]);

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
