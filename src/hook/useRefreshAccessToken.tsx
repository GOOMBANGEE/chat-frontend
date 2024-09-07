import axios from "axios";
import { deleteCookie, setCookie } from "../Cookie.tsx";
import { useEnvStore } from "../store/EnvStore.tsx";
import { useTokenStore } from "../store/TokenStore.tsx";
import { useGlobalStore } from "../store/GlobalStore.tsx";

export default function useRefreshAccessToken() {
  const { tokenState, setTokenState, setHeaderAccessToken } = useTokenStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();

  const refreshAccessToken = async (refreshToken: string) => {
    setTokenState({
      refreshToken: refreshToken,
    });

    const today = new Date();
    const expireDate = today.setDate(today.getDate() + 7);
    setCookie("refreshToken", refreshToken, {
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(expireDate),
    });

    try {
      // refreshToken를 쿠키에서 가져와서 실행
      const response = await axios.post(
        `${envState.userUrl}/refresh`,
        {},
        {
          headers: { "Refresh-Token": refreshToken },
        },
      );
      // accessToken 헤더에 담아서 이후 요청보낼때는 Authorization 추가
      const accessToken = response.headers["authorization"].split(" ")[1]; // Bearer {token}
      setHeaderAccessToken(accessToken);

      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // refreshToken이 만료되거나 잘못된 경우 쿠키 삭제하여 로그인 유도
        if (
          error.response &&
          (error.response.data.id === "USER:TOKEN_INVALID" ||
            error.response.data.id === "USER:USER_UNREGISTERED")
        ) {
          deleteCookie(tokenState.refreshTokenKey);
        }
      }
    } finally {
      setGlobalState({
        loading: false,
      });
      setTimeout(() => {
        void refreshAccessToken(refreshToken);
      }, tokenState.tokenExpireTime);
    }
  };

  return { refreshAccessToken };
}
