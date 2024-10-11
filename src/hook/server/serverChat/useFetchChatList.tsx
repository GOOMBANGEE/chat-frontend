import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { useChatStore } from "../../../store/ChatStore.tsx";
import { Chat, ChatInfoList } from "../../../../index";
import devLog from "../../../devLog.ts";
import { useChannelStore } from "../../../store/ChannelStore.tsx";

interface Props {
  channelId: number;
}

export default function useFetchChatList() {
  const { setChannelState } = useChannelStore();
  const { chatListState, setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const componentName = "useFetchChatList";

  const fetchChatList = async (props: Props) => {
    const chatUrl = envState.chatUrl;
    const response = await axios.get(`${chatUrl}/${props.channelId}/list`);

    const newChatList: Chat[] = response.data.chatList.sort(
      (a: Chat, b: Chat) => a.id - b.id,
    );

    const newChatInfo: ChatInfoList = {
      channelId: props.channelId,
      chatList: newChatList,
    };

    const newChatInfoList = [...chatListState, newChatInfo];
    devLog(componentName, "setChatListState");
    setChatListState(newChatInfoList);

    devLog(componentName, "setChannelState fetchChatList true");
    setChannelState({ fetchChatList: true });
  };

  return { fetchChatList };
}
