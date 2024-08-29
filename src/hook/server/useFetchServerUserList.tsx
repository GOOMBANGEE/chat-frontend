import { useEnvStore } from "../../store/EnvStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import axios from "axios";

interface Props {
  serverId: number;
}

export default function useFetchServerUserList() {
  const { setServerUserListState } = useServerStore();
  const { envState } = useEnvStore();

  const fetchServerUserList = async (props: Props) => {
    const serverUrl = envState.serverUrl;
    const response = await axios.get(
      `${serverUrl}/${props.serverId}/list/user`,
    );

    setServerUserListState(response.data.serverUserInfoDtoList);
  };

  return { fetchServerUserList };
}
