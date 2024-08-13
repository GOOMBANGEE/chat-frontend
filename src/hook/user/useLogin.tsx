import { useEnvStore } from "../../store/EnvStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import axios from "axios";
import { useGlobalStore } from "../../store/GlobalStore.tsx";
import { useTokenStore } from "../../store/TokenStore.tsx";
import { setCookie } from "../../Cookie.tsx";
import useRefreshAccessToken from "../useRefreshAccessToken.tsx";

export default function useLogin() {
  const { refreshAccessToken } = useRefreshAccessToken();
  const { userState, setUserState } = useUserStore();
  const { setTokenState } = useTokenStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();

  const login = async () => {
    try {
      const response = await axios.post(`${envState.userUrl}/login`, {
        email: userState.email,
        password: userState.password,
      });
      const refreshToken = response.data.refreshToken;

      setUserState({ password: undefined });
      setGlobalState({ loginExpire: false });
      setTokenState({
        refreshToken: refreshToken,
      });

      const today = new Date();
      const expireDate = today.setDate(today.getDate() + 7);
      setCookie("refreshToken", refreshToken, {
        sameSite: "strict",
        path: "/",
        expires: new Date(expireDate),
      });

      void refreshAccessToken(refreshToken);
      return true;
    } catch (error) {
      return false;
    }
  };

  return { login };
}
