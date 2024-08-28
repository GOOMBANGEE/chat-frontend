import { Chat, ServerInfo, StompChatMessage } from "../../index";
import { useChatStore } from "../store/ChatStore.tsx";
import { useUserStore } from "../store/UserStore.tsx";
import { useServerStore } from "../store/ServerStore.tsx";
import { useNavigate } from "react-router-dom";

export default function useReceiveStompMessageHandler() {
  const { chatListState, setChatListState } = useChatStore();
  const { serverState, serverListState, setServerListState } = useServerStore();
  const { userState } = useUserStore();
  const navigate = useNavigate();

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
      };
      newChatList = [...chatListState, newChat];
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
          return { ...chat, message: message.message };
        }
        return chat;
      });
      setChatListState(newChatList);
      return;
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
      setServerListState(newServerList);
      return;
    }

    // 서버 삭제
    if (message.messageType === "DELETE_SERVER") {
      newServerList = serverListState.filter(
        (server) => server.id !== message.serverId,
      );
      setServerListState(newServerList);
      navigate("/server", { replace: true });
      return;
    }
  };

  return { receiveStompMessageHandler };
}
