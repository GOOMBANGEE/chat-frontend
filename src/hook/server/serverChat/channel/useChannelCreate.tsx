import { useEnvStore } from "../../../../store/EnvStore.tsx";
import axios from "axios";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import devLog from "../../../../devLog.ts";

export default function useChannelCreate() {
  const { serverState } = useServerStore();
  const { categoryState } = useCategoryStore();
  const {
    channelState,
    setChannelState,
    channelListState,
    setChannelListState,
  } = useChannelStore();
  const { envState } = useEnvStore();
  const componentName = "useChannelCreate";

  const channelCreate = async () => {
    const channelUrl = envState.channelUrl;

    const response = await axios.post(
      `${channelUrl}/${serverState.id}/create`,
      {
        name: channelState.createModalName,
        // allowRoleIdList: ,
        // allowUserIdList: ,
        categoryId: categoryState.id,
      },
    );
    devLog(componentName, "setChannelState createModal false");
    setChannelState({
      createModalOpen: false,
      createModalName: undefined,
      createModalOptionOpen: false,
    });

    const newChannel = {
      id: response.data.id,
      name: response.data.name,
      displayOrder: response.data.displayOrder,
      serverId: response.data.serverId,
      categoryId: response.data.categoryId,
    };
    const newChannelList = [...channelListState, newChannel];
    devLog(componentName, "setChannelListState newChannelList");
    setChannelListState(newChannelList);
    return response.data.id;
  };

  return { channelCreate };
}
