import { Chat, ServerInfo, StompChatMessage, UserInfo } from "../../index";
import { useChatStore } from "../store/ChatStore.tsx";
import { useUserStore } from "../store/UserStore.tsx";
import { useServerStore } from "../store/ServerStore.tsx";
import { useNavigate } from "react-router-dom";
import devLog from "../devLog.ts";

export default function useReceiveStompMessageHandler() {
  const { chatListState, setChatListState } = useChatStore();
  const {
    serverState,
    serverListState,
    setServerListState,
    serverUserListState,
    setServerUserListState,
  } = useServerStore();
  const {
    userState,
    userFriendListState,
    setUserFriendListState,
    userFriendWaitingListState,
    setUserFriendWaitingListState,
  } = useUserStore();
  const navigate = useNavigate();
  const componentName = "useReceiveStompMessageHandler";

  const receiveStompMessageHandler = (message: StompChatMessage) => {
    let newChatList: Chat[] = [];
    let newChat: Chat;
    // 들어온 메세지가 현재 들어가있는 serverId와 같은경우 chatList 갱신
    if (
      message.messageType === "SEND" &&
      message.serverId === serverState.id &&
      message.username !== userState.username
    ) {
      newChat = {
        id: message.chatId,
        username: message.username,
        message: message.message,
        createTime: message.createTime,
        updateTime: message.createTime,
      };
      newChatList = [...chatListState, newChat];

      devLog(componentName, "SEND setChatListState newChatList");
      setChatListState(newChatList);
      return;
    }

    if (
      message.messageType === "DELETE_CHAT" &&
      message.serverId === serverState.id
    ) {
      newChatList = chatListState.filter(
        (chat: Chat) => chat.id !== message.chatId,
      );
      devLog(componentName, "DELETE_CHAT setChatListState newChatList");
      setChatListState(newChatList);
      return;
    }

    if (
      message.messageType === "UPDATE_CHAT" &&
      message.serverId === serverState.id &&
      message.username !== userState.username
    ) {
      newChatList = chatListState.map((chat: Chat) => {
        if (chat.id === message.chatId) {
          return {
            ...chat,
            message: message.message,
            updateTime: message.updateTime,
          };
        }
        return chat;
      });
      devLog(componentName, "UPDATE_CHAT setChatListState newChatList");
      setChatListState(newChatList);
      return;
    }

    let newUserList = [];
    let newUser: UserInfo;
    if (message.enter && message.serverId === serverState.id) {
      newChat = {
        id: message.chatId,
        username: message.username,
        message: message.message,
        enter: true,
        createTime: message.createTime,
        updateTime: message.createTime,
      };
      newChatList = [...chatListState, newChat];
      devLog(componentName, "ENTER setChatListState newChatList");
      setChatListState(newChatList);

      newUser = {
        id: message.userId,
        username: message.username,
      };
      newUserList = [...serverUserListState, newUser];
      devLog(componentName, "ENTER setChatListState newChatList");
      setServerUserListState(newUserList);
      return;
    }

    if (message.leave && message.serverId === serverState.id) {
      newUserList = serverUserListState.filter(
        (user) => user.id !== message.userId,
      );
      devLog(componentName, "LEAVE setChatListState newChatList");
      setServerUserListState(newUserList);
    }

    // 들어온 메세지가 현재 들어가있는 serverId와 다른경우 무시 -> 알림만 남김

    let newServerList: ServerInfo[] = [];
    // 서버이름변경
    // 해당하는 서버 id찾아서 server의 name변경
    if (message.messageType === "INFO") {
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
    if (message.messageType === "DELETE_SERVER") {
      newServerList = serverListState.filter(
        (server) => server.id !== message.serverId,
      );
      devLog(componentName, "DELETE_SERVER setServerListState newServerList");
      setServerListState(newServerList);
      navigate("/server", { replace: true });
      return;
    }

    // 친구요청을 받은 경우
    if (message.friendRequest) {
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
    if (message.friendAccept) {
      const newFriend = {
        id: message.userId,
        username: message.username,
      };
      const newFriendList = [...userFriendListState, newFriend];
      devLog(componentName, "setUserFriendListState");
      setUserFriendListState(newFriendList);
    }

    // 친구삭제 요청이 들어온 경우
    if (message.friendDelete) {
      const newFriendList = userFriendListState.filter(
        (user) => user.id !== message.userId,
      );
      devLog(componentName, "setUserFriendListState");
      setUserFriendListState(newFriendList);
    }
  };

  return { receiveStompMessageHandler };
}
