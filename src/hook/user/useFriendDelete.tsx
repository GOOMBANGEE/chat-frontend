import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios from "axios";

export default function useFriendDelete() {
  const { userState } = useUserStore();
  const { envState } = useEnvStore();

  const friendDelete = async () => {
    const userUrl = envState.userUrl;

    await axios.post(`${userUrl}/friend`, {
      username: userState.username,
      friendId: userState.focusUserId,
    });
  };

  return { friendDelete };
}
