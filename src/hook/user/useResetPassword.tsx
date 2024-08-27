import { toast } from "react-toastify";
import { useEnvStore } from "../../store/EnvStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import axios, { isAxiosError } from "axios";

export default function useResetPassword() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();

  const resetPassword = async () => {
    const userUrl = envState.userUrl;
    try {
      await axios.post(`${userUrl}/reset/password`, {
        prevPassword: userState.password,
        newPassword: userState.newPassword,
      });
      setUserState({
        password: undefined,
        newPassword: undefined,
        newConfirmPassword: undefined,
      });
      toast.success("비밀번호 변경이 완료되었습니다.");
    } catch (error) {
      if (isAxiosError(error)) {
        setUserState({
          passwordVerified: false,
          passwordErrorMessage: error.response?.data.message,
        });
      }
    }
  };

  return { resetPassword };
}
