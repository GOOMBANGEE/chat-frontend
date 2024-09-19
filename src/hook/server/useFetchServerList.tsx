import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../store/ServerStore.tsx";
import { useCategoryStore } from "../../store/CategoryStore.tsx";
import { useChannelStore } from "../../store/ChannelStore.tsx";

export default function useFetchServerList() {
  const { setServerListState } = useServerStore();
  const { setCategoryListState } = useCategoryStore();
  const { setChannelListState } = useChannelStore();
  const { envState } = useEnvStore();

  const fetchServerList = async () => {
    // accessToken의 subServer와 db에서 확인된 subServer가 다른경우 refreshToken가져옴
    const response = await axios.get(`${envState.serverUrl}/list`);
    setServerListState(response.data.serverList);
    setCategoryListState(response.data.categoryList);
    setChannelListState(response.data.channelList);
    const refreshToken = response.headers["refresh-token"];
    if (refreshToken) {
      return refreshToken;
    }
    return null;
  };

  return { fetchServerList };
}
