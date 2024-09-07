import { useEnvStore } from "../../store/EnvStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import axios from "axios";
import { toast } from "react-toastify";

export default function useServerDelete() {
  const { serverState, resetServerState } = useServerStore();
  const { envState } = useEnvStore();

  const serverDelete = async () => {
    const serverUrl = envState.serverUrl;

    const response = await axios.post(`${serverUrl}/${serverState.id}/delete`, {
      name: serverState.checkServerName,
    });

    resetServerState();
    toast.success("삭제가 완료되었습니다.");

    return response.headers["refresh-token"];
  };

  return { serverDelete };
}
