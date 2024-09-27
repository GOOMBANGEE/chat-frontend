import { useChannelStore } from "../../../store/ChannelStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../../store/ServerStore.tsx";
import devLog from "../../../devLog.ts";

interface Props {
  chatId: number;
}

export default function useReadMessage() {
  const { serverState } = useServerStore();
  const {
    channelState,
    setChannelState,
    channelListState,
    setChannelListState,
  } = useChannelStore();
  const { envState } = useEnvStore();
  const componentName = "useReadMessage";

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

    devLog(componentName, "setChannelListState newChannelList");
    setChannelListState(newChannelList);

    devLog(componentName, "setChannelState");
    setChannelState({
      lastReadMessageId: channelState.newMessageId,
      newMessage: false,
      fetchChatList: true,
    });
  };

  return { readMessage };
}
