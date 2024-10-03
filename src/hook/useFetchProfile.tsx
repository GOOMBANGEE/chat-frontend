import axios from "axios";
import { useEnvStore } from "../store/EnvStore.tsx";
import { useUserStore } from "../store/UserStore.tsx";
import { useGlobalStore } from "../store/GlobalStore.tsx";
import devLog from "../devLog.ts";

export default function useFetchProfile() {
  const { setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();
  const componentName = "useFetchProfile";

  const fetchProfile = async () => {
    const userUrl = envState.userUrl;

    try {
      const response = await axios.get(`${userUrl}/profile`);
      devLog(componentName, "setUserState");
      setUserState({
        id: response.data.id,
        email: response.data.email,
        username: response.data.username,
        avatar: response.data.avatar,

        login: true,
      });
    } catch (error) {
      devLog(componentName, "setGlobalState");
      setGlobalState({ loginExpire: true });
    } finally {
      devLog(componentName, "setGlobalState");
      setGlobalState({ fetchProfile: true });
    }
  };

  return { fetchProfile };
}
