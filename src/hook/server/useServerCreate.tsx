import { useEnvStore } from "../../store/EnvStore.tsx";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import axios from "axios";
import { useUserStore } from "../../store/UserStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";

export default function useServerCreate() {
  const { serverAddState, resetServerAddState } = useServerAddStore();
  const { serverListState, setServerListState } = useServerStore();
  const { userState } = useUserStore();
  const { envState } = useEnvStore();

  const serverCreate = async () => {
    const serverUrl = envState.serverUrl;
    const response = await axios.post(`${serverUrl}/create`, {
      username: userState.username,
      name: serverAddState.name,
    });

    const newServer = {
      id: response.data.id,
      name: response.data.name,
      icon: "",
    };
    const newServerList = [...serverListState, newServer];
    setServerListState(newServerList);
    resetServerAddState();

    const refreshToken = response.headers["refresh-token"];
    return { serverId: response.data.id, refreshToken };
  };

  return { serverCreate };
}
