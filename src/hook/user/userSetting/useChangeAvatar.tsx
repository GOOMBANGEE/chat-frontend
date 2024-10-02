import { useUserStore } from "../../../store/UserStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { toast } from "react-toastify";

export default function useChangeAvatar() {
  const { userState } = useUserStore();
  const { envState } = useEnvStore();
  // const componentName = "useChangeAvatar";

  const changeAvatar = async () => {
    const userUrl = envState.userUrl;

    try {
      await axios.post(`${userUrl}/change/avatar`, {
        id: userState.id,
        avatar: userState.newAvatarImage,
      });

      // todo setAvatar image
      // devLog(componentName, "setUserState");
      // setUserState({  });

      toast.success("아바타 변경이 완료되었습니다");
    } catch (error) {
      // todo
      // devLog(componentName, "setUserState");
      // setUserState({  });
    }
  };

  return { changeAvatar };
}
