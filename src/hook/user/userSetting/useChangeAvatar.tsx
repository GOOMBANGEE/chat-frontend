import { useUserStore } from "../../../store/UserStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import devLog from "../../../devLog.ts";

export default function useChangeAvatar() {
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useChangeAvatar";

  const changeAvatar = async () => {
    const userUrl = envState.userUrl;

    try {
      const response = await axios.post(`${userUrl}/change/avatar`, {
        id: userState.id,
        avatar: userState.newAvatarImage,
      });

      devLog(componentName, "setUserState");
      setUserState({
        avatar: response.data.avatarImageSmall,
        userSettingAvatarChangeModal: false,
        newAvatarImage: undefined,
      });

      toast.success("아바타 변경이 완료되었습니다");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return { changeAvatar };
}
