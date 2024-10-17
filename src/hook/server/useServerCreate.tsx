import { useEnvStore } from "../../store/EnvStore.tsx";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import axios, { isAxiosError } from "axios";
import { useUserStore } from "../../store/UserStore.tsx";
import { useServerStore } from "../../store/ServerStore.tsx";
import devLog from "../../devLog.ts";
import { useChannelStore } from "../../store/ChannelStore.tsx";
import { useCategoryStore } from "../../store/CategoryStore.tsx";
import { ChannelInfo, ServerInfo } from "../../../index";
import { toast } from "react-toastify";

export default function useServerCreate() {
  const { serverAddState, resetServerAddState } = useServerAddStore();
  const { setServerState, serverListState, setServerListState } =
    useServerStore();
  const { setCategoryListState } = useCategoryStore();
  const { channelListState, setChannelState, setChannelListState } =
    useChannelStore();
  const { userState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useServerCreate";

  const serverCreate = async () => {
    try {
      const serverUrl = envState.serverUrl;
      const response = await axios.post(`${serverUrl}/create`, {
        userId: userState.id,
        username: userState.username,
        name: serverAddState.name,
        icon: serverAddState.icon,
      });

      const newServer: ServerInfo = {
        id: response.data.id,
        name: response.data.name,
        icon: response.data.icon,
      };
      const newServerList = [...serverListState, newServer];
      devLog(componentName, "setServerState");
      setServerState({
        id: response.data.id,
        name: response.data.name,
        icon: response.data.icon,
      });

      devLog(componentName, "setServerListState newServerList");
      setServerListState(newServerList);

      devLog(componentName, "resetServerAddState");
      resetServerAddState();

      const newCategory = {
        id: response.data.categoryId,
        name: response.data.categoryName,
        displayOrder: response.data.categoryDisplayOrder,
        serverId: response.data.id,
      };
      const newCategoryList = [newCategory];
      devLog(componentName, "setCategoryListState newCategoryList");
      setCategoryListState(newCategoryList);

      devLog(componentName, "setChannelState");
      setChannelState({
        id: response.data.channelId,
        name: response.data.channelName,
      });

      const newChannel: ChannelInfo = {
        id: response.data.channelId,
        name: response.data.channelName,
        displayOrder: response.data.channelDisplayOrder,
        lastReadMessageId: undefined,
        lastMessageId: undefined,
        serverId: response.data.id,
        categoryId: response.data.categoryId,
        userDirectMessageId: undefined,
        username: undefined,
        avatarImageSmall: undefined,
      };
      const newChannelList = [...channelListState, newChannel];
      devLog(componentName, "setChannelListState newChannelList");
      setChannelListState(newChannelList);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return { serverCreate };
}
