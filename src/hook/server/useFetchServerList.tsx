import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../store/ServerStore.tsx";

export default function useFetchServerList() {
  const { setServerListState } = useServerStore();
  const { envState } = useEnvStore();

  const fetchServerList = async () => {
    const response = await axios.get(`${envState.serverUrl}/list`);
    setServerListState(response.data.serverList);
  };

  return { fetchServerList };
}
