import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { useChatStore } from "../../../store/ChatStore.tsx";
import { Chat, ChatInfoList } from "../../../../index";
import devLog from "../../../devLog.ts";

interface Props {
  serverId: number;
  channelId: number;
}

export default function useFetchChatList() {
  const { chatListState, setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const componentName = "useFetchChatList";

  const fetchChatList = async (props: Props) => {
    const chatUrl = envState.chatUrl;
    const response = await axios.get(
      `${chatUrl}/${props.serverId}/${props.channelId}/list`,
    );

    const newChatList = response.data.chatList.sort(
      (a: Chat, b: Chat) => a.id - b.id,
    );

    const newChatInfo: ChatInfoList = {
      serverId: props.serverId,
      channelId: props.channelId,
      chatList: newChatList,
    };

    // todo
    // 이미 해당 채널에 대한 state가 있는지 확인

    const newChatInfoList = [...chatListState, newChatInfo];
    devLog(componentName, "setChatListState");
    setChatListState(newChatInfoList);
  };

  return { fetchChatList };
}
