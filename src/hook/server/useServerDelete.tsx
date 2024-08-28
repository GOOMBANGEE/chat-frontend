import { useEnvStore } from "../../store/EnvStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import axios from "axios";
import { toast } from "react-toastify";

export default function useServerDelete() {
  const { serverState, resetServerState } = useServerStore();
  const { envState } = useEnvStore();

  const serverDelete = async () => {
    const serverUrl = envState.serverUrl;

    await axios.post(`${serverUrl}/delete/${serverState.id}`, {
      name: serverState.checkServerName,
    });
    resetServerState();
    toast.success("삭제가 완료되었습니다.");
  };

  return { serverDelete };
}
