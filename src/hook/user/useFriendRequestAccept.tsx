import { useUserStore } from "../../store/UserStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import devLog from "../../devLog.ts";
import { UserInfo } from "../../../index";

interface Props {
  id: number;
  username: string;
  friendId: number;
  friendUsername: string;
  friendAvatarImageSmall: string;
  friendOnline: boolean;
}

export default function useFriendRequestAccept() {
  const {
    userFriendListState,
    setUserFriendListState,
    userFriendWaitingListState,
    setUserFriendWaitingListState,
  } = useUserStore();
  const { envState } = useEnvStore();
  const componentName = "useFriendRequestAccept";

  const friendRequestAccept = async (props: Props) => {
    const userUrl = envState.userUrl;

    try {
      await axios.post(`${userUrl}/friend/accept`, {
        id: props.id,
        username: props.username,
        friendId: props.friendId,
      });

      const newFriend: UserInfo = {
        id: props.friendId,
        username: props.friendUsername,
        avatarImageSmall: props.friendAvatarImageSmall,
        online: props.friendOnline,
      };

      const newFriendList = [...userFriendListState, newFriend];
      devLog(componentName, "setUserFriendListState");
      setUserFriendListState(newFriendList);

      const newWaitingList = userFriendWaitingListState.filter(
        (user) => user.id !== props.friendId,
      );
      devLog(componentName, "setUserFriendWaitingListState");
      setUserFriendWaitingListState(newWaitingList);

      toast.success("친구등록이 완료되었습니다");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return { friendRequestAccept };
}
