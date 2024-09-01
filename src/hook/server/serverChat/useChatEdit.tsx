import { useChatStore } from "../../../store/ChatStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useParams } from "react-router-dom";
import { Chat } from "../../../../index";

interface Props {
  chat: Chat;
  chatList: Chat[];
}

export default function useChatEdit() {
  const { setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const { serverId } = useParams();

  const chatEdit = async (props: Props) => {
    const chatUrl = envState.chatUrl;
    const message = {
      serverId: serverId,
      chatId: props.chat.id,
      username: props.chat.username,
      message: props.chat.message,
    };

    try {
      await axios.patch(chatUrl, message);
    } catch (error) {
      if (isAxiosError(error)) {
        // 해당 id를 찾아서 발송문제를 표시
        const newChatList = props.chatList.map((chat: Chat) => {
          if (chat.id === props.chat.id) {
            return { ...chat, error: true };
          }
          return chat;
        });

        setChatListState(newChatList);
      }
    }
  };

  return { chatEdit };
}
