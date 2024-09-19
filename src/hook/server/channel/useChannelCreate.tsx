import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../../store/ServerStore.tsx";
import { useCategoryStore } from "../../../store/CategoryStore.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";

export default function useChannelCreate() {
  const { serverState } = useServerStore();
  const { categoryState } = useCategoryStore();
  const { channelState } = useChannelStore();
  const { envState } = useEnvStore();

  const channelCreate = async () => {
    const channelUrl = envState.channelUrl;

    await axios.post(`${channelUrl}/${serverState.id}/create`, {
      name: channelState.createModalName,
      // allowRoleIdList: ,
      // allowUserIdList: ,
      categoryId: categoryState.id,
    });
  };

  return { channelCreate };
}
