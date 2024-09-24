import { useEnvStore } from "../../store/EnvStore.tsx";
import { useParams } from "react-router-dom";
import axios, { isAxiosError } from "axios";
import { useServerStore } from "../../store/ServerStore.tsx";
import { toast } from "react-toastify";
import devLog from "../../devLog.ts";
import { useChannelStore } from "../../store/ChannelStore.tsx";

export default function useServerLeave() {
  const { serverListState, setServerListState } = useServerStore();
  const { channelListState, setChannelListState } = useChannelStore();
  const { envState } = useEnvStore();
  const { serverId } = useParams();
  const componentName = "useServerLeave";

  const serverLeave = async () => {
    const serverUrl = envState.serverUrl;

    try {
      await axios.post(`${serverUrl}/${serverId}/leave`);

      const newServerList = serverListState.filter(
        (server) => server.id !== Number(serverId),
      );
      devLog(componentName, "setServerListState newServerList");
      setServerListState(newServerList);

      const newChannelList = channelListState.filter(
        (channel) => channel.serverId !== Number(serverId),
      );
      devLog(componentName, "setChannelListState newChannelList");
      setChannelListState(newChannelList);

      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return { serverLeave };
}
