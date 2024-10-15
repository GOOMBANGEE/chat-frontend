import { useEnvStore } from "../../../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import devLog from "../../../../devLog.ts";
import { ChannelInfo } from "../../../../../index";
import { toast } from "react-toastify";

interface Props {
  serverId: number | undefined;
  userId: number | undefined;
}

export default function useChannelCreate() {
  const { categoryState } = useCategoryStore();
  const {
    channelState,
    setChannelState,
    channelListState,
    setChannelListState,
    directMessageChannelListState,
    setDirectMessageChannelListState,
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
        serverId: props?.serverId !== undefined ? props.serverId : undefined,
        categoryId: categoryState.id,
        userId: props?.userId !== undefined ? props.userId : undefined,
      });
      devLog(componentName, "setChannelState createModal false");
      setChannelState({
        createModalOpen: false,
        createModalName: undefined,
        createModalOptionOpen: false,
      });

      if (response.data.mentionedUserId) {
        const newChannel: ChannelInfo = {
          id: response.data.id,
          name: undefined,
          displayOrder: undefined,
          lastReadMessageId: undefined,
          lastMessageId: undefined,
          serverId: undefined,
          categoryId: undefined,
          userDirectMessageId: response.data.mentionedUserId,
          username: response.data.mentionedUsername,
          avatarImageSmall: response.data.mentionedUserAvatar,
        };
        const newChannelList = [...directMessageChannelListState, newChannel];
        devLog(
          componentName,
          "setDirectMessageChannelListState newChannelList",
        );
        setDirectMessageChannelListState(newChannelList);
      } else {
        const newChannel: ChannelInfo = {
          id: response.data.id,
          name: undefined,
          displayOrder: response.data.displayOrder,
          lastReadMessageId: undefined,
          lastMessageId: undefined,
          serverId: response.data.serverId,
          categoryId: response.data.categoryId,
          userDirectMessageId: undefined,
          username: undefined,
          avatarImageSmall: undefined,
        };
        const newChannelList = [...channelListState, newChannel];
        devLog(componentName, "setChannelListState newChannelList");
        setChannelListState(newChannelList);
      }
      return response.data.id;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return { channelCreate };
}
