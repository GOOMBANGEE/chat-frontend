import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import axios from "axios";
import { Chat, ChatInfoList } from "../../../../index";
import devLog from "../../../devLog.ts";
import { useChannelStore } from "../../../store/ChannelStore.tsx";

export default function useChatDelete() {
  const { channelState } = useChannelStore();
  const { chatState, chatListState, setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const componentName = "useChatDelete";

  const chatDelete = async () => {
    const chatUrl = envState.chatUrl;
    await axios.delete(`${chatUrl}/${channelState.id}/${chatState.id}`);

    const newChatList: ChatInfoList[] = chatListState.map((chatInfo) => {
      return {
        ...chatInfo,
        chatList: chatInfo.chatList.filter(
          (chat: Chat) => chat.id !== chatState.id,
        ),
      };
    });
    devLog(componentName, "setChatListState newChatList");
    setChatListState(newChatList);
  };

  return { chatDelete };
}
