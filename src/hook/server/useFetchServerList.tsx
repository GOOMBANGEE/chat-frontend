import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../store/ServerStore.tsx";
import { useCategoryStore } from "../../store/CategoryStore.tsx";
import { useChannelStore } from "../../store/ChannelStore.tsx";
import { useGlobalStore } from "../../store/GlobalStore.tsx";

export default function useFetchServerList() {
  const { setServerListState } = useServerStore();
  const { setCategoryListState } = useCategoryStore();
  const { setChannelListState } = useChannelStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();

  const fetchServerList = async () => {
    try {
      const response = await axios.get(`${envState.serverUrl}/list`);
      setServerListState(response.data.serverList);
      setCategoryListState(response.data.categoryList);
      setChannelListState(response.data.channelList);
    } finally {
      setGlobalState({ fetchServerList: true });
    }
  };

  return { fetchServerList };
}
