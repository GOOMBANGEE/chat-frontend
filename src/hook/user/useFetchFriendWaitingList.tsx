import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";

export default function useFetchFriendWaitingList() {
  const { setUserFriendWaitingListState } = useUserStore();
  const { envState } = useEnvStore();

  const fetchFriendWaitingList = async () => {
    const userUrl = envState.userUrl;

    const response = await axios.get(`${userUrl}/friend/waiting/list`);
    setUserFriendWaitingListState(response.data.waitingList);
  };

  return { fetchFriendWaitingList };
}