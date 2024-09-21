import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";
import devLog from "../../devLog.ts";

export default function useFriendDelete() {
  const { userState, userFriendListState, setUserFriendListState } =
    useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useFriendDelete";

  const friendDelete = async () => {
    const userUrl = envState.userUrl;

    await axios.post(`${userUrl}/friend/delete`, {
      id: userState.id,
      username: userState.username,
      friendId: userState.focusUserId,
    });
    const newFriendList = userFriendListState.filter(
      (user) => user.id !== userState.focusUserId,
    );

    devLog(componentName, "setUserFriendListState");
    setUserFriendListState(newFriendList);
  };

  return { friendDelete };
}
