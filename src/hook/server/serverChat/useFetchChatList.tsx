import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { useChatStore } from "../../../store/ChatStore.tsx";
import { Chat } from "../../../../index";

interface Props {
  serverId: number;
}

export default function useFetchChatList() {
  const { setChatListState } = useChatStore();
  const { envState } = useEnvStore();

  const fetchChatList = async (props: Props) => {
    const chatUrl = envState.chatUrl;
    const response = await axios.get(`${chatUrl}/list/${props.serverId}`);
    setChatListState(
      response.data.chatList.sort((a: Chat, b: Chat) => a.id - b.id),
    );
    return response.data.chatList;
  };

  return { fetchChatList };
}
