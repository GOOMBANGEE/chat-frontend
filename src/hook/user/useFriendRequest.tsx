import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export default function useFriendRequest() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();

  const friendRequest = async () => {
    const userUrl = envState.userUrl;

    try {
      await axios.post(`${userUrl}/friend`, {
        username: userState.username,
        friendId: userState.focusUserId,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setUserState({
        serverChatUserListContextMenu: false,
        focusUserId: undefined,
        focusUsername: undefined,
      });
    }
  };

  return { friendRequest };
}
