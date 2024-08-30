import { useUserStore } from "../../../store/UserStore.tsx";
import ServerIndexFriendHeader from "./ServerIndexFriendHeader.tsx";
import ServerIndexFriendWaitingList from "./ServerIndexFriendWaitingList.tsx";
import ServerIndexFriendList from "./ServerIndexFriendList.tsx";

export default function ServerIndexFriend() {
  const { userState } = useUserStore();

  return (
    <div className={"flex h-full w-full flex-col"}>
      <ServerIndexFriendHeader />
      {userState.indexPageFriendList ? <ServerIndexFriendList /> : null}
      {userState.indexPageFriendRequestList ? (
        <ServerIndexFriendWaitingList />
      ) : null}
    </div>
  );
}
