import axios from "axios";
import { useEnvStore } from "../store/EnvStore.tsx";
import { useUserStore } from "../store/UserStore.tsx";
import { useGlobalStore } from "../store/GlobalStore.tsx";

export default function useFetchProfile() {
  const { setUserState } = useUserStore();
  const { envState } = useEnvStore();
  const { setGlobalState } = useGlobalStore();

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${envState.userUrl}/profile`);
      setUserState({ username: response.data.username, login: true });
    } catch (error) {
      setGlobalState({ loginExpire: true });
    } finally {
      setGlobalState({ fetchProfile: true });
    }
  };

  return { fetchProfile };
}
