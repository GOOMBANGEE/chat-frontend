import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

interface Props {
  id: number;
  username: string;
}

export default function useFriendRequestReject() {
  const { userFriendWaitingListState, setUserFriendWaitingListState } =
    useUserStore();
  const { envState } = useEnvStore();

  const friendRequestReject = async (props: Props) => {
    const userUrl = envState.userUrl;

    try {
      await axios.post(`${userUrl}/friend/reject`, {
        id: props.id,
        username: props.username,
      });

      const newWaitingList = userFriendWaitingListState.filter(
        (user) => user.id !== props.id,
      );
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
