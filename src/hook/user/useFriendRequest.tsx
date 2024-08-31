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
        id: userState.id,
        username: userState.username,
        friendId: userState.focusUserId,
      });
      toast.success("친구신청을 보냈습니다");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setUserState({
        userContextMenu: false,
        focusUserId: undefined,
        focusUsername: undefined,
      });
    }
  };

  return { friendRequest };
}
