import { useChatStore } from "../../../store/ChatStore.tsx";
import { useParams } from "react-router-dom";
import axios, { isAxiosError } from "axios";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { Chat } from "../../../../index";
import devLog from "../../../devLog.ts";

interface Props {
  chat: Chat;
  chatList: Chat[];
}

export default function useSendChatMessage() {
  const { setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const { serverId, channelId } = useParams();
  const componentName = "useSendChatMessage";

  const sendChatMessage = async (props: Props) => {
    const chatUrl = envState.chatUrl;
    const message = {
      messageType: "CHAT_SEND",
      serverId: serverId,
      channelId: channelId,
      username: props.chat.username,
      message: props.chat.message,
    };

    try {
      const response = await axios.post(chatUrl, message);
      // response 들어오면 해당 id를 찾아서 서버의 serverChat id 부여
      const newChatList = props.chatList.map((chat: Chat) => {
        if (chat.id === props.chat.id) {
          return {
            ...chat,
            id: response.data.id,
            createTime: response.data.createTime,
            updateTime: response.data.createTime,
          };
        }
        return chat;
      });

      devLog(componentName, "setChatListState");
      setChatListState(newChatList);
    } catch (error) {
      if (isAxiosError(error)) {
        // 해당 id를 찾아서 발송문제를 표시
        const newChatList = props.chatList.map((chat: Chat) => {
          if (chat.id === props.chat.id) {
            console.log(chat);
            return { ...chat, error: true };
          }
          return chat;
        });
        devLog(componentName, "setChatListState");
        setChatListState(newChatList);
      }
    }
  };

  return { sendChatMessage };
}
