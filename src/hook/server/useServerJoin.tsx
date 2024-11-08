import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import devLog from "../../devLog.ts";
import { ServerInfo } from "../../../index";

interface Props {
  code: string;
}

export default function useServerJoin() {
  const { setServerAddState, resetServerAddState } = useServerAddStore();
  const { serverListState, setServerListState } = useServerStore();
  const { envState } = useEnvStore();
  const componentName = "useServerJoin";

  const serverJoin = async (prop: Props) => {
    try {
      const serverUrl = envState.serverUrl;
      const response = await axios.post(`${serverUrl}/${prop.code}/join`);

      const newServer: ServerInfo = {
        id: response.data.id,
        name: response.data.name,
        icon: response.data.icon,
        newMessage: false,
      };
      const newServerList = [...serverListState, newServer];

      devLog(componentName, "setServerListState newServerList");
      setServerListState(newServerList);
      devLog(componentName, "resetServerAddState");
      resetServerAddState();

      return { id: response.data.id, channelId: response.data.channelId };
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
