import axios from "axios";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import devLog from "../../../devLog.ts";

export default function useUsernameCheck() {
  const { setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useUsernameCheck";

  const usernameCheck = async (username: string) => {
    try {
      const response = await axios.post(`${envState.userUrl}/username/check`, {
        username: username,
      });
      devLog(componentName, "setUserState");
      setUserState({ usernameVerified: response.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        devLog(componentName, "setUserState");
        setUserState({ usernameVerified: false });
        switch (error.response?.data.id) {
          case "VALID:USERNAME_FORM_ERROR":
            devLog(componentName, "setUserState");
            setUserState({
              usernameErrorMessage: "사용자명은 2~20자로 설정해주세요.",
            });
            break;
          case "USER:USERNAME_EXIST":
            devLog(componentName, "setUserState");
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
