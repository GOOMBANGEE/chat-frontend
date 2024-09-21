import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Chat } from "../../../../index";
import devLog from "../../../devLog.ts";

export default function useChatDelete() {
  const { chatState, chatListState, setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const { serverId } = useParams();
  const componentName = "useChatDelete";

  const chatDelete = async () => {
    const chatUrl = envState.chatUrl;
    await axios.delete(`${chatUrl}/${serverId}/${chatState.id}`);

    const newChatList = chatListState.filter(
      (chat: Chat) => chat.id !== chatState.id,
    );
    devLog(componentName, "setChatListState newChatList");
    setChatListState(newChatList);
  };

  return { chatDelete };
}
