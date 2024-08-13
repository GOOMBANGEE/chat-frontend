import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import axios from "axios";
import { useGlobalStore } from "../../../store/GlobalStore.tsx";

export default function useRegister() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();

  const register = async () => {
    try {
      await axios.post(`${envState.userUrl}/register`, {
        email: userState.email,
        username: userState.username,
        password: userState.password,
        confirmPassword: userState.confirmPassword,
      });
      setUserState({ password: undefined, confirmPassword: undefined });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setGlobalState({ errorMessage: error.response?.data.message });
      }
      return false;
    }
  };

  return { register };
}
