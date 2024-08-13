import { useUserStore } from "../../../store/UserStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export function useRegisterConfirm() {
  const { userState, resetUserState } = useUserStore();
  const { envState } = useEnvStore();
  const { token } = useParams();

  const registerConfirm = async () => {
    try {
      await axios.post(`${envState.userUrl}/register/confirm`, {
        token: token,
        email: userState.email,
      });
      resetUserState();
      toast.success("가입이 완료되었습니다.");
      return true;
    } catch (error) {
      toast.warn("문제가 발생했습니다. 다시 시도해주세요.");
      return false;
    }
  };

  return { registerConfirm };
}
