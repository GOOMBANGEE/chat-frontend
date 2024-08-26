import { useServerStore } from "../../store/ServerStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useParams } from "react-router-dom";
import { useGlobalStore } from "../../store/GlobalStore.tsx";

export default function useFetchServerInfo() {
  const { setServerState } = useServerStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();
  const { code } = useParams();

  const fetchServerInfo = async () => {
    const serverUrl = envState.serverUrl;
    try {
      const response = await axios.get(`${serverUrl}/invite/${code}`);

      setServerState({
        name: response.data.name,
        inviteUsername: response.data.username,
        userCount: response.data.userCount,
        fetchServerInfo: true,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        setServerState({
          fetchServerInfo: true,
        });
        setGlobalState({ errorMessage: error.response?.data.message });
      }
    }
  };
  return { fetchServerInfo };
}
