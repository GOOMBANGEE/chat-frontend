import { useServerStore } from "../../store/ServerStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useParams } from "react-router-dom";
import { useGlobalStore } from "../../store/GlobalStore.tsx";
import devLog from "../../devLog.ts";

export default function useFetchServerInfo() {
  const { setServerState } = useServerStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();
  const { code } = useParams();
  const componentName = "useFetchServerInfo";

  const fetchServerInfo = async () => {
    const serverUrl = envState.serverUrl;
    try {
      const response = await axios.get(`${serverUrl}/${code}/invite`);

      devLog(componentName, "setServerState");
      setServerState({
        name: response.data.name,
        icon: response.data.icon,
        inviteUsername: response.data.username,
        userCount: response.data.userCount,
        fetchServerInfo: true,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        devLog(componentName, "setServerState");
        setServerState({
          fetchServerInfo: true,
        });
        devLog(componentName, "setGlobalState");
        setGlobalState({ errorMessage: error.response?.data.message });
      }
    }
  };
  return { fetchServerInfo };
}
