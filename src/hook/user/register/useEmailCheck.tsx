import axios from "axios";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import devLog from "../../../devLog.ts";

export default function useEmailCheck() {
  const { setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useEmailCheck";

  const emailCheck = async (email: string) => {
    try {
      const response = await axios.post(`${envState.userUrl}/email/check`, {
        email: email,
      });
      devLog(componentName, "setUserState");
      setUserState({ emailVerified: response.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        devLog(componentName, "setUserState");
        setUserState({ emailVerified: false });
        switch (error.response?.data.id) {
          case "VALID:EMAIL_FORM_ERROR":
            devLog(componentName, "setUserState");
            setUserState({
              emailErrorMessage: "유효하지 않은 이메일입니다.",
            });
            break;
          case "USER:EMAIL_EXIST":
            devLog(componentName, "setUserState");
            setUserState({
              emailErrorMessage: "이미 존재하는 이메일입니다.",
            });
            break;
          default:
            break;
        }
      }
      return false;
    }
  };

  return { emailCheck };
}
