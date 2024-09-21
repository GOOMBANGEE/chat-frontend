import { useEnvStore } from "../../store/EnvStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import { toast } from "react-toastify";
import { deleteCookie } from "../../Cookie.tsx";
import axios from "axios";
import devLog from "../../devLog.ts";

export default function useUserDelete() {
  const { userState, resetUserState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useUserDelete";

  const userDelete = async () => {
    const userUrl = envState.userUrl;
    await axios.post(`${userUrl}/delete`, { password: userState.password });

    deleteCookie("refreshToken");

    devLog(componentName, "resetUserState");
    resetUserState();

    toast.success("탈퇴가 완료되었습니다.");
  };

  return { userDelete };
}
