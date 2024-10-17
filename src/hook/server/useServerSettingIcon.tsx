import { useEnvStore } from "../../store/EnvStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import axios from "axios";

export default function useServerSettingIcon() {
  const { serverState } = useServerStore();
  const { envState } = useEnvStore();

  const serverSettingIcon = async () => {
    const serverUrl = envState.serverUrl;

    await axios.post(`${serverUrl}/${serverState.id}/setting/icon`, {
      icon: serverState.newServerIcon,
    });
  };

  return { serverSettingIcon };
}
