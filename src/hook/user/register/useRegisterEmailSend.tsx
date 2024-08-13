import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export default function useRegisterEmailSend() {
  const { userState } = useUserStore();
  const { envState } = useEnvStore();

  const registerEmailSend = async () => {
    try {
      await axios.post(`${envState.userUrl}/register/email/send`, {
        email: userState.email,
      });
      toast.success("메일이 정상적으로 발송되었습니다.");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.warn("메일 발송에 문제가 발생했습니다.");
      }
    }
  };

  return { registerEmailSend };
}
