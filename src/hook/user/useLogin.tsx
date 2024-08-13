import { useEnvStore } from "../../store/EnvStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import axios from "axios";
import { useGlobalStore } from "../../store/GlobalStore.tsx";

export default function useLogin() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();

  const login = async () => {
    try {
      await axios.post(`${envState.userUrl}/login`, {
        email: userState.email,
        password: userState.password,
      });
      setUserState({ password: undefined });
      setGlobalState({ loginExpire: false });
      return true;
    } catch (error) {
      return false;
    }
  };

  return { login };
}
