import ServerIndexDMList from "./ServerIndexDMList.tsx";
import ServerIndexFriend from "./ServerIndexFriend.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import UserContextMenu from "../UserContextMenu.tsx";

export default function ServerIndex() {
  const { userState } = useUserStore();

  return (
    <div className={"flex h-full w-full"}>
      <ServerIndexDMList />
      <ServerIndexFriend />

      {userState.userContextMenu ? <UserContextMenu /> : null}
    </div>
  );
}
