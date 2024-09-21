import { useUserStore } from "../../../store/UserStore.tsx";
import { useGlobalStore } from "../../../store/GlobalStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import devLog from "../../../devLog.ts";

export default function useRegisterTokenCheck() {
  const { setUserState } = useUserStore();
  const { setGlobalState } = useGlobalStore();
  const { envState } = useEnvStore();
  const { token } = useParams();
  const componentName = "useRegisterTokenCheck";

  const registerTokenCheck = async () => {
    try {
      const response = await axios.get(`${envState.userUrl}/${token}/register`);
      devLog(componentName, "setUserState");
      setUserState({
        email: response.data.email,
      });
    } finally {
      devLog(componentName, "setGlobalState");
      setGlobalState({
        loading: false,
      });
    }
  };

  return { registerTokenCheck };
}
