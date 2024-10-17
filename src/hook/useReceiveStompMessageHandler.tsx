import {
  CategoryInfo,
  ChannelInfo,
  Chat,
  ChatInfoList,
  NotificationInfo,
  ServerInfo,
  StompChatMessage,
  UserInfo,
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
    directMessageChannelListState,
    setDirectMessageChannelListState,
  } = useChannelStore();
  const {
    userState,
    userFriendListState,
    setUserFriendListState,
    userFriendWaitingListState,
    setUserFriendWaitingListState,
    userNotificationListState,
    setUserNotificationListState,
  } = useUserStore();
  const navigate = useNavigate();

  const componentName = "useReceiveStompMessageHandler";

  let newServerList: ServerInfo[] = [];
  let newCategoryList: CategoryInfo[] = [];
  let newChannelList: ChannelInfo[] = [];
  let newChatInfoList: ChatInfoList[] = [];
  let newUserList = [];

  const receiveStompMessageHandler = (message: StompChatMessage) => {
    // 들어온 메세지가 현재 들어가있는 channelId 같은경우 chatList 갱신
    if (
      message.messageType === "CHAT_SEND" &&
      message.username !== userState.username
    ) {
      const newChat: Chat = {
        id: message.chatId,
        username: message.username,
        avatarImageSmall: message.avatar,
        message: message.message,
        createTime: message.createTime,
        updateTime: message.createTime,
        attachment: message.attachment,
        attachmentWidth: message.attachmentWidth,
        attachmentHeight: message.attachmentHeight,
      };

      newChatInfoList = chatListState.map((chatInfoList) => {
        if (chatInfoList.channelId === message.channelId) {
          return {
            ...chatInfoList,
            chatList: [...chatInfoList.chatList, newChat], // 기존 채팅에 새 채팅추가
          };
        }
        return chatInfoList;
      });

      // 보고있는 채널인 경우 && focus 중인 채널
      if (channelState.id === message.channelId) {
        newChannelList = channelListState.map((channelInfo) => {
          if (channelInfo.id === channelState.id) {
            return {
              ...channelInfo,
              lastMessageId: message.chatId,
              newMessageId: message.chatId,
            };
          }
          return channelInfo;
        });

        devLog(componentName, "setChannelListState");
        setChannelListState(newChannelList);
        // scrollBottom -> 맨 아래에 스크롤 위치
        if (channelState.windowFocus && channelState.scrollBottom) {
          devLog(componentName, "setChannelState");
          setChannelState({
            lastMessageId: message.chatId,
            newMessage: true,
            newMessageId: message.chatId,
            newMessageScroll: true,
          });
        } else {
          // scroll 다른곳에 위치해 있다면 -> 스크롤 강제로 아래로 내리지않음
          devLog(componentName, "setChannelState");
          setChannelState({
            lastMessageId: message.chatId,
            newMessage: true,
            newMessageId: message.chatId,
          });
        }
      }

      // 보고있지않은 채널인 경우 -> 해당되는 채널의 lastMessageId 업데이트
      if (channelState.id !== message.channelId) {
        newChannelList = channelListState.map((channelInfo) => {
          // 해당되는 채널
          if (channelInfo.id === message.channelId) {
            return { ...channelInfo, lastMessageId: message.chatId };
          }
          return channelInfo;
        });
        devLog(componentName, "CHAT_SEND setChannelListState");
        setChannelListState(newChannelList);
      }

      // dm채널에 들어오는 메시지의 경우 userNotification update
      const directMessageChannel = channelListState.find(
        (channelInfo) =>
          channelInfo.id === message.channelId &&
          channelInfo.userDirectMessageId,
      );

      if (directMessageChannel) {
        const newNotification: NotificationInfo = {
          channelId: message.channelId,
          channelName: null,
          chatId: message.chatId,
          chatMessage: message.message,
          chatAttachment: message.attachment ? message.attachment : null,
          chatCreateTime: message.createTime ? message.createTime : null,
          chatUpdateTime: message.createTime ? message.createTime : null,
          userId: message.chatId,
          username: message.username,
          avatarImageSmall: message.avatar,
        };
        const newNotificationDirectMessage: NotificationInfo[] = [
          newNotification,
          ...userNotificationListState.notificationDirectMessageInfoDtoList,
        ];
        setUserNotificationListState({
          notificationDirectMessageInfoDtoList: newNotificationDirectMessage,
        });
      }

      devLog(componentName, "CHAT_SEND setChatListState newChatList");
      setChatListState(newChatInfoList);
      return;
    }

    if (
      message.messageType === "CHAT_UPDATE" &&
      message.username !== userState.username
    ) {
      newChatInfoList = chatListState.map((chatInfoList) => {
        if (chatInfoList.channelId === message.channelId) {
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
      message.username !== userState.username
    ) {
      newChatInfoList = chatListState.map((chatInfoList) => {
        if (chatInfoList.channelId === message.channelId) {
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
        if (chatInfoList.channelId === message.channelId) {
          return {
            ...chatInfoList,
            chatList: [...chatInfoList.chatList, newChat], // 기존 채팅에 새 채팅추가
          };
        }
        return chatInfoList;
      });

      devLog(componentName, "SERVER_ENTER setChatListState newChatList");
      setChatListState(newChatInfoList);

      const newUser: UserInfo = {
        id: message.userId,
        username: message.username,
        avatarImageSmall: message.avatar,
        online: message.online,
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
    if (message.messageType === "SERVER_UPDATE_NAME") {
      const parsedMessage = JSON.parse(message.message);
      newServerList = serverListState.map((server: ServerInfo) => {
        if (server.id === message.serverId) {
          return { ...server, name: parsedMessage.name };
        }
        return server;
      });
      devLog(
        componentName,
        "SERVER_UPDATE_NAME setServerListState newServerList",
      );
      setServerListState(newServerList);
      return;
    }

    // 서버아이콘변경
    // 해당하는 서버 id찾아서 server의 icon변경
    if (message.messageType === "SERVER_UPDATE_ICON") {
      const parsedMessage = JSON.parse(message.message);
      newServerList = serverListState.map((server: ServerInfo) => {
        if (server.id === message.serverId) {
          return { ...server, icon: parsedMessage.icon };
        }
        return server;
      });
      devLog(
        componentName,
        "SERVER_UPDATE_ICON setServerListState newServerList",
      );
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
          return { ...channel, categoryId: undefined };
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

      const newChannel: ChannelInfo = {
        id: channelData.id,
        name: channelData.name,
        displayOrder: channelData.displayOrder,
        lastReadMessageId: undefined,
        lastMessageId: undefined,
        serverId: channelData.serverId,
        categoryId: channelData.categoryId,
        userDirectMessageId: undefined,
        username: undefined,
        avatarImageSmall: undefined,
      };
      newChannelList = [...channelListState, newChannel];

      devLog(
        componentName,
        "CHANNEL_CREATE setChannelListState newChannelList",
      );
      setChannelListState(newChannelList);
      return;
    }

    // dm채널 생성
    if (message.messageType === "CHANNEL_CREATE_DIRECT_MESSAGE") {
      const channelData = JSON.parse(message.message);

      const newChannel: ChannelInfo = {
        id: channelData.id,
        name: undefined,
        displayOrder: undefined,
        lastReadMessageId: undefined,
        lastMessageId: undefined,
        serverId: undefined,
        categoryId: undefined,
        userDirectMessageId: channelData.userId,
        username: channelData.username,
        avatarImageSmall: channelData.avatar,
      };
      newChannelList = [...directMessageChannelListState, newChannel];

      devLog(
        componentName,
        "CHANNEL_CREATE_DIRECT_MESSAGE setDirectMessageChannelListState newChannelList",
      );
      setDirectMessageChannelListState(newChannelList);
      return;
    }

    // 유저 온라인
    if (message.messageType === "USER_ONLINE") {
      const newServerUserList = serverUserListState.map((userInfo) => {
        if (userInfo.id === message.userId) {
          return { ...userInfo, online: true };
        }
        return userInfo;
      });

      devLog(componentName, "USER_ONLINE setServerUserListState");
      setServerUserListState(newServerUserList);
      return;
    }

    // 유저 오프라인
    if (message.messageType === "USER_OFFLINE") {
      const newServerUserList = serverUserListState.map((userInfo) => {
        if (userInfo.id === message.userId) {
          return { ...userInfo, online: false };
        }
        return userInfo;
      });

      devLog(componentName, "USER_OFFLINE setServerUserListState");
      setServerUserListState(newServerUserList);
      return;
    }

    // 유저이름 업데이트
    if (message.messageType === "USER_UPDATE_USERNAME") {
      const newServerUserList = serverUserListState.map((userInfo) => {
        if (userInfo.id === message.userId) {
          return { ...userInfo, username: message.username };
        }
        return userInfo;
      });

      devLog(componentName, "USER_UPDATE_USERNAME setServerUserListState");
      setServerUserListState(newServerUserList);
      return;
    }

    // 아바타 업데이트
    if (message.messageType === "USER_UPDATE_AVATAR") {
      const newServerUserList = serverUserListState.map((userInfo) => {
        if (userInfo.id === message.userId) {
          return { ...userInfo, avatarImageSmall: message.message };
        }
        return userInfo;
      });

      devLog(componentName, "USER_UPDATE_AVATAR setServerUserListState");
      setServerUserListState(newServerUserList);
      return;
    }

    // 친구요청을 받은 경우
    if (message.messageType === "FRIEND_REQUEST") {
      const newFriendRequest = {
        id: message.userId,
        username: message.username,
        avatarImageSmall: message.avatar,
        online: message.online,
      };
      const newFriendRequestList = [
        ...userFriendWaitingListState,
        newFriendRequest,
      ];

      devLog(componentName, "setUserFriendWaitingListState");
      setUserFriendWaitingListState(newFriendRequestList);
      return;
    }

    // 친구요청이 수락된 경우
    if (message.messageType === "FRIEND_ACCEPT") {
      const newFriend = {
        id: message.userId,
        username: message.username,
        avatarImageSmall: message.avatar,
        online: message.online,
      };
      const newFriendList = [...userFriendListState, newFriend];

      devLog(componentName, "setUserFriendListState");
      setUserFriendListState(newFriendList);
      return;
    }

    // 친구삭제 요청이 들어온 경우
    if (message.messageType === "FRIEND_DELETE") {
      const newFriendList = userFriendListState.filter(
        (user) => user.id !== message.userId,
      );

      devLog(componentName, "setUserFriendListState");
      setUserFriendListState(newFriendList);
      return;
    }
  };

  return { receiveStompMessageHandler };
}
