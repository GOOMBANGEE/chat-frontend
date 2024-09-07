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
      const response = await axios.post(`${envState.userUrl}/login`, {
        email: userState.email,
        password: userState.password,
      });
      // 헤더에서 refreshToken 추출
      const refreshToken = response.headers["refresh-token"];

      setUserState({ password: undefined });
      setGlobalState({ loginExpire: false });

      return refreshToken;
    } catch (error) {
      return false;
    }
  };

  return { login };
}
