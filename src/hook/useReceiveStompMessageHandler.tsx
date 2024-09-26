import {
  CategoryInfo,
  ChannelInfo,
  Chat,
  ChatInfoList,
  ServerInfo,
  StompChatMessage,
} from "../../index";
import { useChatStore } from "../store/ChatStore.tsx";
import { useUserStore } from "../store/UserStore.tsx";
import { useServerStore } from "../store/ServerStore.tsx";
import { useNavigate } from "react-router-dom";
import devLog from "../devLog.ts";
import { useChannelStore } from "../store/ChannelStore.tsx";
import { useCategoryStore } from "../store/CategoryStore.tsx";

export default function useReceiveStompMessageHandler() {
  const { chatListState, setChatListState } = useChatStore();
  const {
    serverState,
    serverListState,
    setServerListState,
    serverUserListState,
    setServerUserListState,
  } = useServerStore();
  const { categoryListState, setCategoryListState } = useCategoryStore();
  const {
    channelState,
    setChannelState,
    channelListState,
    setChannelListState,
  } = useChannelStore();
  const {
    userState,
    userFriendListState,
    setUserFriendListState,
    userFriendWaitingListState,
    setUserFriendWaitingListState,
  } = useUserStore();
  const navigate = useNavigate();

  const componentName = "useReceiveStompMessageHandler";

  let newServerList: ServerInfo[] = [];
  let newCategoryList: CategoryInfo[] = [];
  let newChannelList: ChannelInfo[] = [];
  let newChatInfoList: ChatInfoList[] = [];
  let newUserList = [];

  const receiveStompMessageHandler = (message: StompChatMessage) => {
    // 들어온 메세지가 현재 들어가있는 serverId와 같은경우 chatList 갱신
    if (
      message.messageType === "CHAT_SEND" &&
      message.serverId === serverState.id &&
      message.username !== userState.username
    ) {
      const newChat = {
        id: message.chatId,
        username: message.username,
        message: message.message,
        createTime: message.createTime,
        updateTime: message.createTime,
      };

      newChatInfoList = chatListState.map((chatInfoList) => {
        if (
          chatInfoList.serverId === message.serverId &&
          chatInfoList.channelId === message.channelId
        ) {
          return {
            ...chatInfoList,
            chatList: [...chatInfoList.chatList, newChat], // 기존 채팅에 새 채팅추가
          };
        }
        return chatInfoList;
      });

      // 보고있는 채널인 경우 && focus 중인 채널
      if (channelState.id === message.channelId && channelState.windowFocus) {
        // scrollBottom -> 맨 아래에 스크롤 위치
        if (channelState.scrollBottom) {
          devLog(componentName, "setChannelState");
          setChannelState({
            newMessage: true,
            newMessageId: message.chatId,
            newMessageScroll: true,
          });
        } else {
          // scroll 다른곳에 위치해 있다면 -> 스크롤 강제로 아래로 내리지않음
          devLog(componentName, "setChannelState");
          setChannelState({ newMessage: true, newMessageId: message.chatId });
        }
      }

      devLog(componentName, "CHAT_SEND setChatListState newChatList");
      setChatListState(newChatInfoList);
      return;
    }

    if (
      message.messageType === "CHAT_UPDATE" &&
      message.serverId === serverState.id &&
      message.username !== userState.username
    ) {
      newChatInfoList = chatListState.map((chatInfoList) => {
        if (
          chatInfoList.serverId === message.serverId &&
          chatInfoList.channelId === message.channelId
        ) {
          return {
            ...chatInfoList,
            chatList: chatInfoList.chatList.map((chat: Chat) => {
              if (chat.id === message.chatId) {
                return {
                  ...chat,
                  message: message.message,
                  updateTime: message.updateTime,
                };
              }
              return chat;
            }),
          };
        }
        return chatInfoList;
      });

      devLog(componentName, "CHAT_UPDATE setChatListState newChatList");
      setChatListState(newChatInfoList);
      return;
    }

    if (
      message.messageType === "CHAT_DELETE" &&
      message.serverId === serverState.id &&
      message.username !== userState.username
    ) {
      newChatInfoList = chatListState.map((chatInfoList) => {
        if (
          chatInfoList.serverId === message.serverId &&
          chatInfoList.channelId === message.channelId
        ) {
          return {
            ...chatInfoList,
            chatList: chatInfoList.chatList.filter(
              (chat: Chat) => chat.id !== message.chatId,
            ),
          };
        }
        return chatInfoList;
      });

      devLog(componentName, "CHAT_DELETE setChatListState newChatList");
      setChatListState(newChatInfoList);
      return;
    }

    if (message.messageType === "SERVER_CREATE") {
      navigate(`/server/${message.serverId}/${message.channelId}`);
    }

    if (
      message.messageType === "SERVER_ENTER" &&
      message.serverId === serverState.id
    ) {
      const newChat: Chat = {
        id: message.chatId,
        username: message.username,
        message: message.message,
        enter: true,
        createTime: message.createTime,
        updateTime: message.createTime,
      };

      newChatInfoList = chatListState.map((chatInfoList) => {
        if (
          chatInfoList.serverId === message.serverId &&
          chatInfoList.channelId === message.channelId
        ) {
          return {
            ...chatInfoList,
            chatList: [...chatInfoList.chatList, newChat], // 기존 채팅에 새 채팅추가
          };
        }
        return chatInfoList;
      });

      devLog(componentName, "SERVER_ENTER setChatListState newChatList");
      setChatListState(newChatInfoList);

      const newUser = {
        id: message.userId,
        username: message.username,
      };
      newUserList = [...serverUserListState, newUser];
      devLog(componentName, "ENTER setChatListState newChatList");
      setServerUserListState(newUserList);
      return;
    }

    if (
      message.messageType === "SERVER_LEAVE" &&
      message.serverId === serverState.id
    ) {
      newUserList = serverUserListState.filter(
        (user) => user.id !== message.userId,
      );
      devLog(componentName, "LEAVE setChatListState newChatList");
      setServerUserListState(newUserList);
    }

    // 들어온 메세지가 현재 들어가있는 serverId와 다른경우 무시 -> 알림만 남김

    // 서버이름변경
    // 해당하는 서버 id찾아서 server의 name변경
    if (message.messageType === "SERVER_UPDATE") {
      const parsedMessage = JSON.parse(message.message);
      newServerList = serverListState.map((server: ServerInfo) => {
        if (server.id === message.serverId) {
          return { ...server, name: parsedMessage.name };
        }
        return server;
      });
      devLog(componentName, "SERVER_INFO setServerListState newServerList");
      setServerListState(newServerList);
      return;
    }

    // 서버 삭제
    if (message.messageType === "SERVER_DELETE") {
      newServerList = serverListState.filter(
        (server) => server.id !== message.serverId,
      );
      devLog(componentName, "DELETE_SERVER setServerListState newServerList");
      setServerListState(newServerList);
      navigate("/server", { replace: true });
      return;
    }

    // 카테고리 생성
    if (message.messageType === "CATEGORY_CREATE") {
      const parsedMessage = JSON.parse(message.message);
      const newCategory = {
        id: parsedMessage.id,
        name: parsedMessage.name,
        displayOrder: parsedMessage.displayOrder,
        serverId: parsedMessage.serverId,
      };
      newCategoryList = [...categoryListState, newCategory];

      devLog(
        componentName,
        "CATEGORY_CREATE setCategoryListState newCategoryList",
      );
      setCategoryListState(newCategoryList);
      return;
    }

    // 카테고리 삭제
    // 해당 카테고리에 포함된 채널들을 카테고리 null로 표시
    if (message.messageType === "CATEGORY_DELETE") {
      newCategoryList = categoryListState.filter(
        (category: CategoryInfo) => category.id !== message.categoryId,
      );
      newChannelList = channelListState.map((channel: ChannelInfo) => {
        if (channel.categoryId === message.categoryId) {
          return { ...channel, categoryId: null };
        }
        return channel;
      });

      devLog(componentName, "CATEGORY_DELETE setChannelListState");
      setChannelListState(newChannelList);

      devLog(
        componentName,
        "CATEGORY_DELETE setCategoryListState newCategoryList",
      );
      setCategoryListState(newCategoryList);
      return;
    }

    // 채널 생성
    if (message.messageType === "CHANNEL_CREATE") {
      const channelData = JSON.parse(message.message);

      const newChannel = {
        id: channelData.id,
        name: channelData.name,
        displayOrder: channelData.displayOrder,
        lastReadMessageId: null,
        lastMessageId: null,
        serverId: channelData.serverId,
        categoryId: channelData.categoryId,
      };
      newChannelList = [...channelListState, newChannel];

      devLog(
        componentName,
        "CHANNEL_CREATE setChannelListState newChannelList",
      );
      setChannelListState(newChannelList);
      return;
    }

    // 친구요청을 받은 경우
    if (message.messageType === "FRIEND_REQUEST") {
      const newFriendRequest = {
        id: message.userId,
        username: message.username,
      };
      const newFriendRequestList = [
        ...userFriendWaitingListState,
        newFriendRequest,
      ];
      devLog(componentName, "setUserFriendWaitingListState");
      setUserFriendWaitingListState(newFriendRequestList);
    }

    // 친구요청이 수락된 경우
    if (message.messageType === "FRIEND_ACCEPT") {
      const newFriend = {
        id: message.userId,
        username: message.username,
      };
      const newFriendList = [...userFriendListState, newFriend];
      devLog(componentName, "setUserFriendListState");
      setUserFriendListState(newFriendList);
    }

    // 친구삭제 요청이 들어온 경우
    if (message.messageType === "FRIEND_DELETE") {
      const newFriendList = userFriendListState.filter(
        (user) => user.id !== message.userId,
      );
      devLog(componentName, "setUserFriendListState");
      setUserFriendListState(newFriendList);
    }
  };

  return { receiveStompMessageHandler };
}
