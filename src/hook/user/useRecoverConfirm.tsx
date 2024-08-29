import { useEnvStore } from "../../store/EnvStore.tsx";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../store/UserStore.tsx";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export default function useRecoverConfirm() {
  const { userState, resetUserState } = useUserStore();
  const { envState } = useEnvStore();
  const { token } = useParams();

  const recoverConfirm = async () => {
    const userUrl = envState.userUrl;
    try {
      await axios.post(`${userUrl}/recover/confirm`, {
        token: token,
        email: userState.email,
        password: userState.password,
      });
      resetUserState();
      toast.success("비밀번호가 재설정 되었습니다.");
      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.message);
        return false;
      }
    }
  };

  return { recoverConfirm };
}
