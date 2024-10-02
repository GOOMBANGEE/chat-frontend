import { toast } from "react-toastify";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import axios, { isAxiosError } from "axios";
import devLog from "../../../devLog.ts";

export default function useChangePassword() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useChangePassword";

  const changePassword = async () => {
    const userUrl = envState.userUrl;
    try {
      await axios.post(`${userUrl}/change/password`, {
        prevPassword: userState.password,
        newPassword: userState.newPassword,
      });

      devLog(componentName, "setUserState");
      setUserState({
        password: undefined,
        newPassword: undefined,
        newConfirmPassword: undefined,
      });

      toast.success("비밀번호 변경이 완료되었습니다");
    } catch (error) {
      if (isAxiosError(error)) {
        devLog(componentName, "setUserState");
        setUserState({
          passwordVerified: false,
          passwordErrorMessage: error.response?.data.message,
        });
      }
    }
  };

  return { changePassword };
}
