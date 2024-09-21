import { useEnvStore } from "../../../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import devLog from "../../../../devLog.ts";

export default function useFetchServerInviteCode() {
  const { serverState, setServerState } = useServerStore();
  const { envState } = useEnvStore();
  const componentName = "useFetchServerInviteCode";

  const fetchServerInviteCode = async () => {
    const serverUrl = envState.serverUrl;

    try {
      const response = await axios.post(
        `${serverUrl}/${serverState.id}/invite`,
      );
      devLog(componentName, "setServerState inviteLink");
      setServerState({ inviteLink: response.data.link });
      return response.data.link;
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
      }
    }
  };

  return { fetchServerInviteCode };
}
