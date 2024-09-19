import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../../store/ServerStore.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";

export default function useChannelRename() {
  const { serverState } = useServerStore();
  const { channelState } = useChannelStore();
  const { envState } = useEnvStore();

  const channelRename = async () => {
    const channelUrl = envState.channelUrl;

    await axios.post(
      `${channelUrl}/${serverState.id}/${channelState.id}/rename`,
      {
        name: channelState.newName,
      },
    );
  };

  return { channelRename };
}
