import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../store/ServerStore.tsx";

export default function useFetchServerList() {
  const { setServerListState } = useServerStore();
  const { envState } = useEnvStore();

  const fetchServerList = async () => {
    // accessToken의 subServer와 db에서 확인된 subServer가 다른경우 refreshToken가져옴
    const response = await axios.get(`${envState.serverUrl}/list`);
    setServerListState(response.data.serverList);
    const refreshToken = response.headers["refresh-token"];
    if (refreshToken) {
      return refreshToken;
    }
    return null;
  };

  return { fetchServerList };
}
