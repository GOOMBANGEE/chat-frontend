import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";

interface Props {
  code: string;
}

export default function useServerJoin() {
  const { setServerAddState, resetServerAddState } = useServerAddStore();
  const { serverListState, setServerListState } = useServerStore();
  const { envState } = useEnvStore();

  const serverJoin = async (
    prop: Props,
  ): Promise<{ serverId: string; refreshToken: string } | undefined> => {
    try {
      const serverUrl = envState.serverUrl;
      const response = await axios.post(`${serverUrl}/${prop.code}/join`);

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
    } catch (error) {
      if (isAxiosError(error)) {
        setServerAddState({
          codeVerified: false,
          codeErrorMessage: error.response?.data.message,
        });
        return undefined;
      }
    }
  };

  return { serverJoin };
}
