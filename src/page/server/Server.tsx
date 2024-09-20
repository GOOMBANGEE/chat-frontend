import { useGlobalStore } from "../../store/GlobalStore.tsx";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
import { useChannelStore } from "../../store/ChannelStore.tsx";
import ChannelCreateModal from "./serverChat/ChannelCreateModal.tsx";

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
  const { channelState, setChannelState, channelListState } = useChannelStore();
  const { envState } = useEnvStore();
  const { stompState, setStompState } = useStompStore();
  const { tokenState } = useTokenStore();
  const { globalState } = useGlobalStore();

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

  // 새로고침시 server, channel 상태 저장
  // 경로 바뀔때, server list 가져왔을때, 경로검증 + serverState change
  const serverId = Number(location.pathname.split("/")[2]);
  const channelId = Number(location.pathname.split("/")[3]);
  useEffect(() => {
    checkPath({ rootPath, routePathList });
    if (userState.username && serverId && channelId) {
      const server = serverListState.find((server) => server.id === serverId);
      const channel = channelListState.find(
        (channel) => channel.id === channelId,
      );
      setServerState({ id: server?.id, name: server?.name });
      setChannelState({ id: channel?.id, name: channel?.name });
    }
  }, [serverListState, channelListState, location.pathname]);

  // server 바뀔때 fetch server chat, user list
  useEffect(() => {
    if (serverState.id) {
      fetchChatList({ serverId: serverState.id });
      fetchServerUserList({ serverId: serverState.id });
    }
  }, [serverState.id]);

  // stomp 연결
  const [stompClient, setStompClient] = useState<Client | undefined>(undefined);
  const [activeSubscription, setActiveSubscription] = useState<Set<string>>(
    new Set(),
  );

  // 초기 stomp 연결
  const initializeStompClient = () => {
    if (!stompClient) {
      const stompUrl = envState.stompUrl;
      const newStompClient = new Client({
        brokerURL: stompUrl,
        onConnect: () => {
          setStompClient(newStompClient);
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
      if (stompClient) {
        stompClient.deactivate();
        setStompClient(undefined);
      }
    };
  }, [tokenState.accessToken]);
  // stomp 메시지 수신
  useEffect(() => {
    if (stompState.chatMessage)
      receiveStompMessageHandler(stompState.chatMessage);
  }, [stompState.chatMessage]);

  // 유저, 서버, 채널 변경시 추가로 구독
  const subscribeToTopic = (subscriptionUrl: string) => {
    if (
      // 이미 추가되어있는 url이면 추가구독하지않음
      !activeSubscription.has(subscriptionUrl) &&
      stompClient?.active &&
      userState.id
    ) {
      stompClient.subscribe(
        subscriptionUrl,
        (message: IMessage) => {
          const receiveMessage = JSON.parse(message.body);
          setStompState({ chatMessage: receiveMessage });
        },
        {
          id: userState.id.toString(),
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      );
      // 구독중인 경로 추가
      setActiveSubscription((prevSubscriptions) => {
        const newSubscription = new Set(prevSubscriptions);
        newSubscription.add(subscriptionUrl);
        return newSubscription;
      });
    }
  };

  useEffect(() => {
    if (stompClient?.active) {
      if (userState.id) {
        const userSubscriptionUrl = `/sub/user/${userState.id}`;
        subscribeToTopic(userSubscriptionUrl);
      }
      if (serverId && serverState.id) {
        const serverSubscriptionUrl = `/sub/server/${serverState.id}`;
        subscribeToTopic(serverSubscriptionUrl);
      }
      if (serverId && serverState.id && channelId && channelState.id) {
        const channelSubscriptionUrl = `/sub/channel/${serverState.id}/${channelState.id}`;
        subscribeToTopic(channelSubscriptionUrl);
      }
    }
  }, [
    userState.id,
    serverId,
    channelId,
    serverState.id,
    channelState.id,
    location.pathname,
    stompClient,
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
          </Routes>
        </div>

        {serverAddState.open ? <ServerAddModal /> : null}
        {serverState.inviteModalOpen ? <ServerInviteModal /> : null}

        {channelState.createModalOpen ? <ChannelCreateModal /> : null}
      </div>
    );
  };

  return renderPage();
}
