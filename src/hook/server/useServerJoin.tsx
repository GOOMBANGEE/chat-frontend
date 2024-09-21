import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import devLog from "../../devLog.ts";

interface Props {
  code: string;
}

export default function useServerJoin() {
  const { setServerAddState, resetServerAddState } = useServerAddStore();
  const { serverListState, setServerListState } = useServerStore();
  const { envState } = useEnvStore();
  const componentName = "useServerJoin";

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

      devLog(componentName, "setServerListState newServerList");
      setServerListState(newServerList);
      devLog(componentName, "resetServerAddState");
      resetServerAddState();

      return response.data.id;
    } catch (error) {
      if (isAxiosError(error)) {
        devLog(componentName, "setServerAddState");
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
