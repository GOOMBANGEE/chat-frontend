import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function useServerJoin() {
  const { envState } = useEnvStore();
  const { code } = useParams();

  const serverJoin = async () => {
    const serverUrl = envState.serverUrl;

    const response = await axios.post(`${serverUrl}/${code}/join`);
    return response.data.serverId;
  };

  return { serverJoin };
}
