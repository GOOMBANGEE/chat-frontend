import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../store/ServerStore.tsx";
import { useCategoryStore } from "../../store/CategoryStore.tsx";
import { useChannelStore } from "../../store/ChannelStore.tsx";
import { useGlobalStore } from "../../store/GlobalStore.tsx";
import devLog from "../../devLog.ts";
import { ChannelInfo, ServerInfo } from "../../../index";

export default function useFetchServerList() {
  const { setServerListState } = useServerStore();
  const { setCategoryListState } = useCategoryStore();
  const { setChannelListState, setDirectMessageChannelListState } =
    useChannelStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();
  const componentName = "useFetchServerList";

  const fetchServerList = async () => {
    try {
      const response = await axios.get(`${envState.serverUrl}/list`);

      devLog(componentName, "setCategoryListState");
      setCategoryListState(response.data.categoryList);
      devLog(componentName, "setChannelListState");
      setChannelListState(response.data.channelList);
      devLog(componentName, "setDirectMessageChannelListState");
      setDirectMessageChannelListState(response.data.directMessageChannelList);

      // 읽지않은 메시지가 있는 채널
      const channelWithUnreadMessage = response.data.channelList.filter(
        (channel: ChannelInfo) => {
          return (
            channel.lastMessageId !== undefined &&
            channel.lastMessageId !== channel.lastReadMessageId
          );
        },
      );

      // 읽지않은 메시지가 있는 서버
      const serverList = response.data.serverList.map((server: ServerInfo) => {
        // 읽지않은 메시지가 있는 채널에 해당하는 서버 찾기
        const hasUnreadMessage = channelWithUnreadMessage.some(
          (channel: ChannelInfo) => channel.serverId === server.id,
        );
        return {
          ...server,
          newMessage: hasUnreadMessage,
        };
      });
      devLog(componentName, "setServerListState");
      setServerListState(serverList);
    } finally {
      devLog(componentName, "setGlobalState fetchServerList true");
      setGlobalState({ fetchServerList: true });
    }
  };

  return { fetchServerList };
}
