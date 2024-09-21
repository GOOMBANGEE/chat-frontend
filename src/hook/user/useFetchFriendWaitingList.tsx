import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";
import devLog from "../../devLog.ts";

export default function useFetchFriendWaitingList() {
  const { setUserFriendWaitingListState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useFetchFriendWaitingList";

  const fetchFriendWaitingList = async () => {
    const userUrl = envState.userUrl;
    const response = await axios.get(`${userUrl}/friend/waiting/list`);

    devLog(componentName, "setUserFriendWaitingList");
    setUserFriendWaitingListState(response.data.waitingList);
  };

  return { fetchFriendWaitingList };
}
