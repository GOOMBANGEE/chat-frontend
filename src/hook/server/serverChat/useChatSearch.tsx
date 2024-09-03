import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useParams } from "react-router-dom";
import { useServerStore } from "../../../store/ServerStore.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import axios from "axios";

interface Props {
  searchDefault?: string;
  searchUser?: string;
  searchMessage?: string;
}

export default function useChatSearch() {
  const { setChatSearchListState } = useChatStore();
  const { setServerState } = useServerStore();
  const { envState } = useEnvStore();
  const { serverId } = useParams();

  const chatSearch = async (props: Props) => {
    try {
      const usernamePrefix = "유저이름:";
      const messagePrefix = "메시지:";
      const keyword = props.searchDefault;
      const username = props.searchUser?.slice(usernamePrefix.length);
      const message = props.searchMessage?.slice(messagePrefix.length);

      const chatUrl = envState.chatUrl;
      const response = await axios.post(`${chatUrl}/${serverId}/search`, {
        keyword: keyword,
        username: username,
        message: message,
      });

      setServerState({ searchOptionMenu: false, searchList: true });
      setChatSearchListState(response.data.chatInfoDtoList);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setChatSearchListState([]);
      }
    }
  };

  return { chatSearch };
}
