import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../store/ServerStore.tsx";
import { useCategoryStore } from "../../store/CategoryStore.tsx";
import { useChannelStore } from "../../store/ChannelStore.tsx";
import { useGlobalStore } from "../../store/GlobalStore.tsx";
import devLog from "../../devLog.ts";

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
      devLog(componentName, "setServerListState");
      setServerListState(response.data.serverList);
      devLog(componentName, "setCategoryListState");
      setCategoryListState(response.data.categoryList);
      devLog(componentName, "setChannelListState");
      setChannelListState(response.data.channelList);
      devLog(componentName, "setDirectMessageChannelListState");
      setDirectMessageChannelListState(response.data.directMessageChannelList);
    } finally {
      devLog(componentName, "setGlobalState fetchServerList true");
      setGlobalState({ fetchServerList: true });
    }
  };

  return { fetchServerList };
}
