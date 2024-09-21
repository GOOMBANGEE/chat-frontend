import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import devLog from "../../devLog.ts";

export default function useFriendRequest() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useFriendRequest";

  const friendRequest = async () => {
    const userUrl = envState.userUrl;

    try {
      await axios.post(`${userUrl}/friend`, {
        id: userState.id,
        username: userState.username,
        friendName: userState.focusUsername,
      });
      toast.success("친구신청을 보냈습니다");
      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      if (userState.userContextMenu) {
        devLog(componentName, "setUserState");
        setUserState({
          userContextMenu: false,
          focusUserId: undefined,
          focusUsername: undefined,
        });
      }
    }
  };

  return { friendRequest };
}
