import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useUserStore } from "../../store/UserStore.tsx";
import { toast } from "react-toastify";

export default function useRecover() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();

  const recover = async () => {
    const userUrl = envState.userUrl;

    try {
      await axios.post(`${userUrl}/recover`, {
        email: userState.email,
      });
      setUserState({ userRecoverEmailSendModal: true });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error("오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return { recover };
}
