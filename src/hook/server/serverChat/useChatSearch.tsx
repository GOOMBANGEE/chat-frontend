import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useServerStore } from "../../../store/ServerStore.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import axios from "axios";
import devLog from "../../../devLog.ts";
import { useChannelStore } from "../../../store/ChannelStore.tsx";

interface Props {
  page?: number;
}

export default function useChatSearch() {
  const { chatSearchListState, setChatSearchListState } = useChatStore();
  const { setServerState } = useServerStore();
  const { channelState } = useChannelStore();
  const { envState } = useEnvStore();
  const componentName = "useChatSearch";

  const chatSearch = async (props: Props) => {
    try {
      const usernamePrefix = "유저이름:";
      const messagePrefix = "메시지:";
      const keyword = chatSearchListState.searchDefault;
      const username = chatSearchListState.searchUser?.slice(
        usernamePrefix.length,
      );
      const message = chatSearchListState.searchMessage?.slice(
        messagePrefix.length,
      );

      const chatUrl = envState.chatUrl;
      const url = props.page
        ? `${chatUrl}/${channelState.id}/search?page=${props.page}`
        : `${chatUrl}/${channelState.id}/search`;
      const response = await axios.post(url, {
        keyword: keyword,
        username: username,
        message: message,
      });

      devLog(componentName, "setServerState searchOptionMenu false");
      setServerState({ searchOptionMenu: false, searchList: true });

      devLog(componentName, "setChatSearchListState");
      setChatSearchListState(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setChatSearchListState({ chatList: [] });
      }
    }
  };

  return { chatSearch };
}
