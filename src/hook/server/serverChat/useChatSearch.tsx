import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useServerStore } from "../../../store/ServerStore.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import axios from "axios";
import devLog from "../../../devLog.ts";
import { useChannelStore } from "../../../store/ChannelStore.tsx";

interface Props {
  searchDefault?: string;
  searchUser?: string;
  searchMessage?: string;
}

export default function useChatSearch() {
  const { setChatSearchListState } = useChatStore();
  const { setServerState } = useServerStore();
  const { channelState } = useChannelStore();
  const { envState } = useEnvStore();
  const componentName = "useChatSearch";

  const chatSearch = async (props: Props) => {
    try {
      const usernamePrefix = "유저이름:";
      const messagePrefix = "메시지:";
      const keyword = props.searchDefault;
      const username = props.searchUser?.slice(usernamePrefix.length);
      const message = props.searchMessage?.slice(messagePrefix.length);

      const chatUrl = envState.chatUrl;
      const response = await axios.post(
        `${chatUrl}/${channelState.id}/search`,
        {
          keyword: keyword,
          username: username,
          message: message,
        },
      );

      devLog(componentName, "setServerState searchOptionMenu false");
      setServerState({ searchOptionMenu: false, searchList: true });

      devLog(componentName, "setChatSearchListState");
      setChatSearchListState(response.data.chatInfoDtoList);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setChatSearchListState([]);
      }
    }
  };

  return { chatSearch };
}
