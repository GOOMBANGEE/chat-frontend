import { useEnvStore } from "../../store/EnvStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import axios from "axios";

export default function useFetchFriendList() {
  const { setUserFriendListState } = useUserStore();
  const { envState } = useEnvStore();

  const fetchFriendList = async () => {
    const userUrl = envState.userUrl;

    const response = await axios.get(`${userUrl}/friend/list`);
    setUserFriendListState(response.data.friendList);
  };

  return { fetchFriendList };
}
