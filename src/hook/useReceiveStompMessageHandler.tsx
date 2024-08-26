import { useParams } from "react-router-dom";
import { Chat, StompChatMessage } from "../../index";
import { useChatStore } from "../store/ChatStore.tsx";
import { useUserStore } from "../store/UserStore.tsx";

export default function useReceiveStompMessageHandler() {
  const { chatListState, setChatListState } = useChatStore();
  const { userState } = useUserStore();
  const { serverId } = useParams();

  const receiveStompMessageHandler = (message: StompChatMessage) => {
    let newChatList: Chat[] = [];
    let newChat: Chat;
    // 들어온 메세지가 현재 들어가있는 serverId와 같은경우 chatList 갱신
    if (
      message.serveId === serverId &&
      message.username !== userState.username
    ) {
      if (message.messageType === "SEND") {
        newChat = {
          id: message.chatId,
          username: message.username,
          message: message.message,
        };
        newChatList = [...chatListState, newChat];
      }

      if (message.messageType === "DELETE") {
        newChatList = chatListState.filter(
          (chat: Chat) => chat.id !== newChat.id,
        );
      }
    }

    setChatListState(newChatList);
    // 들어온 메세지가 현재 들어가있는 serverId와 다른경우 무시 -> 알림만 남김
  };

  return { receiveStompMessageHandler };
}
