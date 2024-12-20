import { useGlobalStore } from "../../store/GlobalStore.tsx";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
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
import useFetchNotification from "../../hook/user/useFetchNotification.tsx";
import { getCookie } from "../../Cookie.tsx";
import useRefreshAccessToken from "../../hook/useRefreshAccessToken.tsx";

export default function Server() {
  const { refreshAccessToken } = useRefreshAccessToken();
  const { stompSubscribe } = useStompSubscribe();
  const { receiveStompMessageHandler } = useReceiveStompMessageHandler();
  const { fetchServerList } = useFetchServerList();
  const { fetchFriendList } = useFetchFriendList();
  const { fetchFriendWaitingList } = useFetchFriendWaitingList();
  const { fetchServerUserList } = useFetchServerUserList();
  const { checkPath } = useCheckPath();
  const { fetchChatList } = useFetchChatList();
  const { fetchNotification } = useFetchNotification();

  const { userState } = useUserStore();
  const { serverAddState } = useServerAddStore();
  const { serverState, setServerState, serverListState } = useServerStore();
  const {
    channelState,
    setChannelState,
    channelListState,
    directMessageChannelListState,
  } = useChannelStore();
  const { chatListState } = useChatStore();
  const { envState } = useEnvStore();
  const { stompState, setStompState } = useStompStore();
  const { tokenState } = useTokenStore();
  const { globalState, setGlobalState } = useGlobalStore();
  const navigate = useNavigate();

  const componentName = "Server";
  const rootPath = "/server";
  const routePathList = ["/", "/:serverId/:channelId", "/dm/:channelId"];

  // accessToken 가져오기
  const refreshToken = getCookie(tokenState.refreshTokenKey);
  const fetchAccessToken = async () => {
    if (!(await refreshAccessToken(refreshToken))) {
      setGlobalState({ fetchProfile: true });
    }
  };
  useEffect(() => {
    fetchAccessToken();
  }, []);

  // 로그인해서 userState.username 변경된 경우
  useEffect(() => {
    if (userState.username) {
      fetchServerList();
      fetchFriendList();
      fetchFriendWaitingList();
      fetchNotification();
    }
  }, [userState.username]);

  // server 바뀔때 fetch server chat, user list
  useEffect(() => {
    if (channelState.id) {
      // chatListState에 해당 serverId, channelId인 chatList가 있는지 확인
      const chatInfoExists = chatListState.some(
        (chatInfo) => chatInfo.channelId === channelState.id,
      );

      // chatList가 없는경우
      if (!chatInfoExists) {
        fetchChatList({ channelId: channelState.id });
      }
      if (serverState.id) fetchServerUserList({ serverId: serverState.id });
    }
  }, [channelState.id]);

  // 초기 stomp 연결
  const initializeStompClient = () => {
    const heartbeat = {
      incoming: 20000,
      outgoing: 20000,
    };
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
        heartbeatIncoming: heartbeat.incoming,
        heartbeatOutgoing: heartbeat.outgoing,
      });
      newStompClient.activate();
    }
  };
  useEffect(() => {
    if (userState.username) initializeStompClient();
    return () => {
      if (stompState.client) {
        stompState.client.deactivate();
        devLog(componentName, "setStompClient undefined");
        setStompState({ client: undefined });
      }
    };
  }, [userState.username, tokenState.accessToken]);
  // stomp 메시지 수신
  useEffect(() => {
    if (stompState.chatMessage)
      receiveStompMessageHandler(stompState.chatMessage);
  }, [stompState.chatMessage]);

  // 최초접속시 subscribe user
  useEffect(() => {
    if (userState.username && stompState.client?.active) {
      // subscribe user
      const userSubscriptionUrl = `/sub/user/${userState.id}`;
      stompSubscribe(userSubscriptionUrl);
    }
  }, [userState.username, stompState.client?.active]);

  // 새로고침, 경로변경시 -> server, channel 상태 저장 , stomp sub
  useEffect(() => {
    let serverId;
    let channelId;
    if (location.pathname.includes("dm")) {
      channelId = Number(location.pathname.split("/")[3]);
    } else {
      serverId = Number(location.pathname.split("/")[2]);
      channelId = Number(location.pathname.split("/")[3]);
    }

    checkPath({ rootPath, routePathList });

    if (userState.username && channelId) {
      // subscribe server
      if (serverId) {
        const server = serverListState.find((server) => server.id === serverId);
        if (server) {
          devLog(componentName, "setServerState");
          setServerState({ id: server.id, name: server.name });
          const serverSubscriptionUrl = `/sub/server/${server.id}`;
          stompSubscribe(serverSubscriptionUrl);
        }
      }

      // subscribe channel
      if (channelListState.length > 0) {
        const channel = channelListState.find(
          (channel) => channel.id === channelId,
        );
        const dmChannel = directMessageChannelListState.find(
          (channel) => channel.id === channelId,
        );
        if (channel) {
          if (dmChannel) {
            console.log("test");
            devLog(componentName, "setChannelState");
            setChannelState({
              id: channel.id,
              name: dmChannel.username ? dmChannel.username : undefined,
              lastReadMessageId: channel.lastReadMessageId
                ? channel.lastReadMessageId
                : undefined,
              lastMessageId: channel.lastMessageId
                ? channel.lastMessageId
                : undefined,
              userDirectMessageId: channel.userDirectMessageId
                ? channel.userDirectMessageId
                : undefined,
              newMessage: channel.lastMessageId !== channel.lastReadMessageId,
            });
          } else {
            devLog(componentName, "setChannelState");
            setChannelState({
              id: channel.id,
              name: channel.name ? channel.name : undefined,
              displayOrder: channel.displayOrder
                ? channel.displayOrder
                : undefined,
              lastReadMessageId: channel.lastReadMessageId
                ? channel.lastReadMessageId
                : undefined,
              lastMessageId: channel.lastMessageId
                ? channel.lastMessageId
                : undefined,
              serverId: channel.serverId ? channel.serverId : undefined,
              categoryId: channel.categoryId ? channel.categoryId : undefined,
              userDirectMessageId: channel.userDirectMessageId
                ? channel.userDirectMessageId
                : undefined,
              newMessage: channel.lastMessageId !== channel.lastReadMessageId,
            });
          }

          const channelSubscriptionUrl = `/sub/channel/${channel.id}`;
          stompSubscribe(channelSubscriptionUrl);
        } else {
          navigate("/server");
        }
      }
    }
  }, [
    userState.username,
    stompState.client?.active,
    serverListState,
    channelListState,
    location.pathname,
  ]);

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
            <Route path={"dm/:channelId"} element={<ServerChat />} />
          </Routes>
        </div>

        {serverAddState.open ? <ServerAddModal /> : null}
        {serverState.inviteModalOpen ? <ServerInviteModal /> : null}
      </div>
    );
  };

  return renderPage();
}
