import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import { useParams } from "react-router-dom";
import axios, { isAxiosError } from "axios";

export default function useRecoverTokenCheck() {
  const { setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const { token } = useParams();

  const recoverTokenCheck = async () => {
    const userUrl = envState.userUrl;

    try {
      const response = await axios.get(`${userUrl}/${token}/recover`);
      setUserState({
        email: response.data.email,
        userRecoverTokenCheck: true,
        userRecoverTokenVerified: true,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        setUserState({
          userRecoverTokenCheck: true,
          userRecoverTokenVerified: false,
        });
      }
    }
  };

  return { recoverTokenCheck };
}
