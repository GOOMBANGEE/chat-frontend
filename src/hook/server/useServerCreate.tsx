import { useEnvStore } from "../../store/EnvStore.tsx";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import axios from "axios";
import { useUserStore } from "../../store/UserStore.tsx";

export default function useServerCreate() {
  const { serverAddState, resetServerAddState } = useServerAddStore();
  const { userState } = useUserStore();
  const { envState } = useEnvStore();

  const serverCreate = async () => {
    const serverUrl = envState.serverUrl;
    const response = await axios.post(`${serverUrl}/`, {
      username: userState.username,
      name: serverAddState.name,
    });

    resetServerAddState();
    return response.data.id;
  };

  return { serverCreate };
}
