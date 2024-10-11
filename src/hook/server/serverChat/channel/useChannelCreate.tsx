import { useEnvStore } from "../../../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import devLog from "../../../../devLog.ts";
import { ChannelInfo } from "../../../../../index";
import { toast } from "react-toastify";

interface Props {
  userId: number | undefined;
}

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

  const channelCreate = async (props?: Readonly<Props>) => {
    const channelUrl = envState.channelUrl;

    try {
      const response = await axios.post(`${channelUrl}/create`, {
        name: channelState.createModalName,
        // allowRoleIdList: ,
        // allowUserIdList: ,
        serverId: serverState.id,
        categoryId: categoryState.id,
        userId: props?.userId !== undefined ? props.userId : undefined,
      });
      devLog(componentName, "setChannelState createModal false");
      setChannelState({
        createModalOpen: false,
        createModalName: undefined,
        createModalOptionOpen: false,
      });

      const newChannel: ChannelInfo = {
        id: response.data.id,
        name: response.data.name,
        displayOrder: response.data.displayOrder,
        lastReadMessageId: undefined,
        lastMessageId: undefined,
        serverId: response.data.serverId,
        categoryId: response.data.categoryId,
        userDirectMessageId: response.data.userDirectMessageId,
      };
      const newChannelList = [...channelListState, newChannel];
      devLog(componentName, "setChannelListState newChannelList");
      setChannelListState(newChannelList);
      return response.data.id;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return { channelCreate };
}
