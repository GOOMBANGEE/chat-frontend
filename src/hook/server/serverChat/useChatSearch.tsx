import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useServerStore } from "../../../store/ServerStore.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";

interface Props {
  keyword: string;
}

export default function useChatSearch() {
  const { setChatSearchListState } = useChatStore();
  const { setServerState } = useServerStore();
  const { envState } = useEnvStore();
  const { serverId } = useParams();

  const chatSearch = async (props: Props) => {
    const usernamePrefix = "보낸유저:";
    const messagePrefix = "메시지:";
    const usernameIndex = props.keyword.indexOf(usernamePrefix);
    const messageIndex = props.keyword.indexOf(messagePrefix);
    let keyword = props.keyword;
    let username: string | null = null;
    let message: string | null = null;

    // 만약 username만 있다면
    if (usernameIndex !== -1 && messageIndex === -1) {
      keyword = props.keyword.slice(0, usernameIndex).replace(/\n/, "");
      username = props.keyword.slice(usernameIndex + usernamePrefix.length);
    }

    // 만약 message만 있다면
    if (usernameIndex === -1 && messageIndex !== -1) {
      keyword = props.keyword.slice(0, messageIndex).replace(/\n/, "");
      message = props.keyword.slice(messageIndex + messagePrefix.length);
    }

    // 둘다있다면
    if (usernameIndex !== -1 && messageIndex !== -1) {
      keyword = props.keyword.slice(0, usernameIndex).replace(/\n/, "");
      username = props.keyword
        .slice(usernameIndex + usernamePrefix.length, messageIndex)
        .replace(/\n/, "");
      message = props.keyword.slice(messageIndex + messagePrefix.length);
    }

    const chatUrl = envState.chatUrl;
    const response = await axios.post(`${chatUrl}/${serverId}/search`, {
      keyword: keyword,
      username: username,
      message: message,
    });

    console.log(response.data);
    setServerState({ serverSearchOption: false, serverSearchList: true });
    setChatSearchListState(response.data.chatInfoDtoList);
  };

  return { chatSearch };
}
