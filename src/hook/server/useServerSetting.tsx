import { useEnvStore } from "../../store/EnvStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import axios from "axios";

export default function useServerSetting() {
  const { serverState } = useServerStore();
  const { envState } = useEnvStore();

  const serverSetting = async () => {
    const serverUrl = envState.serverUrl;

    await axios.post(`${serverUrl}/${serverState.id}/setting`, {
      name: serverState.newServerName,
    });
  };

  return { serverSetting };
}
