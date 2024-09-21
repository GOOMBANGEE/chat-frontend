import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import devLog from "../../devLog.ts";

interface Props {
  id: number;
}

export default function useFriendRequestReject() {
  const { userFriendWaitingListState, setUserFriendWaitingListState } =
    useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useFriendRequestReject";

  const friendRequestReject = async (props: Props) => {
    const userUrl = envState.userUrl;

    try {
      await axios.post(`${userUrl}/friend/reject`, {
        id: props.id,
      });

      const newWaitingList = userFriendWaitingListState.filter(
        (user) => user.id !== props.id,
      );

      devLog(componentName, "setUserFriendWaitingListState");
      setUserFriendWaitingListState(newWaitingList);

      toast.success("친구신청을 거절하였습니다");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return { friendRequestReject };
}
