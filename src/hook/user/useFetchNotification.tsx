import { useEnvStore } from "../../store/EnvStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import axios from "axios";
import { NotificationInfo, NotificationInfoList } from "../../../index";
import devLog from "../../devLog.ts";

export default function useFetchNotification() {
  const { setUserNotificationListState } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useFetchNotification";

  const fetchNotification = async () => {
    const userUrl = envState.userUrl;
    const response = await axios.get(`${userUrl}/notification`);

    const notificationList: NotificationInfoList = {
      notificationDirectMessageInfoDtoList:
        response.data.notificationDirectMessageInfoDtoList.sort(
          (a: NotificationInfo, b: NotificationInfo) => b.chatId - a.chatId,
        ),
      notificationServerInfoDtoList:
        response.data.notificationServerInfoDtoList.sort(
          (a: NotificationInfo, b: NotificationInfo) => b.chatId - a.chatId,
        ),
    };

    devLog(componentName, "setUserNotificationListState");
    setUserNotificationListState(notificationList);
  };
  return { fetchNotification };
}
