import axios from "axios";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";

export default function useUsernameCheck() {
  const { setUserState } = useUserStore();
  const { envState } = useEnvStore();

  const usernameCheck = async (username: string) => {
    try {
      const response = await axios.post(`${envState.userUrl}/username/check`, {
        username: username,
      });
      setUserState({ usernameVerified: response.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setUserState({ usernameVerified: false });
        switch (error.response?.data.id) {
          case "VALID:USERNAME_FORM_ERROR":
            setUserState({
              usernameErrorMessage: "사용자명은 2~20자로 설정해주세요.",
            });
            break;
          case "USER:USERNAME_EXIST":
            setUserState({
              usernameErrorMessage: "이미 존재하는 사용자명입니다.",
            });
            break;
          default:
            break;
        }
      }
      return false;
    }
  };

  return { usernameCheck };
}
