import { toast } from "react-toastify";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import axios, { isAxiosError } from "axios";
import devLog from "../../../devLog.ts";

export default function useChangeUsername() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useChangeUsername";

  const changeUsername = async () => {
    const userUrl = envState.userUrl;
    try {
      await axios.post(`${userUrl}/change/username`, {
        id: userState.id,
        username: userState.newUsername,
      });

      devLog(componentName, "setUserState");
      setUserState({ username: userState.newUsername });

      toast.success("사용자명 변경이 완료되었습니다");
    } catch (error) {
      if (isAxiosError(error)) {
        devLog(componentName, "setUserState");
        setUserState({
          usernameVerified: false,
          usernameErrorMessage: error.response?.data.message,
        });
      }
    }
  };

  return { changeUsername };
}
