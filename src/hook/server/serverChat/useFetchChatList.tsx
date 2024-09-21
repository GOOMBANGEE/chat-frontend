import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { useChatStore } from "../../../store/ChatStore.tsx";
import { Chat } from "../../../../index";
import devLog from "../../../devLog.ts";

interface Props {
  serverId: number;
}

export default function useFetchChatList() {
  const { setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const componentName = "useFetchChatList";

  const fetchChatList = async (props: Props) => {
    const chatUrl = envState.chatUrl;
    const response = await axios.get(`${chatUrl}/${props.serverId}/list`);

    devLog(componentName, "setChatListState");
    setChatListState(
      response.data.chatList.sort((a: Chat, b: Chat) => a.id - b.id),
    );
    return response.data.chatList;
  };

  return { fetchChatList };
}
