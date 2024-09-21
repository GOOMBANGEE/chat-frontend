import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import { useParams } from "react-router-dom";
import axios, { isAxiosError } from "axios";
import devLog from "../../devLog.ts";

export default function useRecoverTokenCheck() {
  const { setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const { token } = useParams();
  const componentName = "useRecoverTokenCheck";

  const recoverTokenCheck = async () => {
    const userUrl = envState.userUrl;

    try {
      const response = await axios.get(`${userUrl}/${token}/recover`);

      devLog(componentName, "setUserState");
      setUserState({
        email: response.data.email,
        userRecoverTokenCheck: true,
        userRecoverTokenVerified: true,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        devLog(componentName, "setUserState");
        setUserState({
          userRecoverTokenCheck: true,
          userRecoverTokenVerified: false,
        });
      }
    }
  };

  return { recoverTokenCheck };
}
