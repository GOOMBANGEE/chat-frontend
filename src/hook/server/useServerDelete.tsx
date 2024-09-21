import { useEnvStore } from "../../store/EnvStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import axios from "axios";
import { toast } from "react-toastify";
import devLog from "../../devLog.ts";

export default function useServerDelete() {
  const { serverState, resetServerState } = useServerStore();
  const { envState } = useEnvStore();
  const componentName = "useServerDelete";

  const serverDelete = async () => {
    const serverUrl = envState.serverUrl;

    await axios.post(`${serverUrl}/${serverState.id}/delete`, {
      name: serverState.checkServerName,
    });

    devLog(componentName, "resetServerState");
    resetServerState();
    toast.success("삭제가 완료되었습니다.");
  };

  return { serverDelete };
}
