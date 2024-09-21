import { useEnvStore } from "../../store/EnvStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import axios from "axios";
import devLog from "../../devLog.ts";

export default function useFetchFriendList() {
  const { setUserFriendListState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useFetchFriendList";
  const fetchFriendList = async () => {
    const userUrl = envState.userUrl;

    const response = await axios.get(`${userUrl}/friend/list`);
    devLog(componentName, "setUserFriendListState");
    setUserFriendListState(response.data.friendList);
  };

  return { fetchFriendList };
}
