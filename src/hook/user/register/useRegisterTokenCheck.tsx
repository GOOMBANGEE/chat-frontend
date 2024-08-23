import { useUserStore } from "../../../store/UserStore.tsx";
import { useGlobalStore } from "../../../store/GlobalStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function useRegisterTokenCheck() {
  const { setUserState } = useUserStore();
  const { setGlobalState } = useGlobalStore();
  const { envState } = useEnvStore();
  const { token } = useParams();

  const registerTokenCheck = async () => {
    try {
      const response = await axios.get(`${envState.userUrl}/register/${token}`);
      setUserState({
        email: response.data.email,
      });
    } finally {
      setGlobalState({
        loading: false,
      });
    }
  };

  return { registerTokenCheck };
}