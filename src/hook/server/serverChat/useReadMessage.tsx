import { useChannelStore } from "../../../store/ChannelStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../../store/ServerStore.tsx";

interface Props {
  chatId: number;
}

export default function useReadMessage() {
  const { serverState } = useServerStore();
  const { channelState, channelListState, setChannelListState } =
    useChannelStore();
  const { envState } = useEnvStore();

  const readMessage = async (props: Readonly<Props>) => {
    const channelUrl = envState.channelUrl;

    await axios.post(
      `${channelUrl}/${serverState.id}/${channelState.id}/${props.chatId}/read`,
    );

    const newChannelList = channelListState.map((channel) => {
      if (channel.id === channelState.id) {
        return { ...channel, lastReadMessageId: props.chatId };
      }
      return channel;
    });
    setChannelListState(newChannelList);
  };

  return { readMessage };
}
