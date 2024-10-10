import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import { Chat } from "../../../../index";
import devLog from "../../../devLog.ts";
import { useServerStore } from "../../../store/ServerStore.tsx";
import axios from "axios";

export default function useFetchChatListBefore() {
  const { serverState } = useServerStore();
  const { channelState, setChannelState } = useChannelStore();
  const { chatListState, setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const componentName = "useFetchChatListBefore";
  const fetchChatListBefore = async () => {
    const chatUrl = envState.chatUrl;
    if (serverState.id && channelState.id) {
      const chatInfoList = chatListState.find(
        (chatInfoList) =>
          chatInfoList.serverId === serverState.id &&
          chatInfoList.channelId === channelState.id,
      );
      if (!chatInfoList) return;
      const chatId = chatInfoList?.chatList[0]?.id;
      if (!chatId) return;

      const response = await axios.get(
        `${chatUrl}/${channelState.id}/${chatId}/list`,
      );

      const newChatList = response.data.chatList.sort(
        (a: Chat, b: Chat) => a.id - b.id,
      );

      const newChatInfoList = chatListState.map((chatInfoList) => {
        if (
          chatInfoList.serverId === serverState.id &&
          chatInfoList.channelId === channelState.id
        ) {
          return {
            ...chatInfoList,
            chatList: [...newChatList, ...chatInfoList.chatList],
          };
        }
        return chatInfoList;
      });
      devLog(componentName, "setChatListState");
      setChatListState(newChatInfoList);

      devLog(componentName, "setChannelState");
      setChannelState({ fetchChatListBefore: true });
    }
  };

  return { fetchChatListBefore };
}
