import ServerIndexDMList from "./ServerIndexDMList.tsx";
import ServerIndexFriend from "./ServerIndexFriend.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import UserContextMenu from "../UserContextMenu.tsx";
import UserInfoMenu from "../UserInfoMenu.tsx";

export default function ServerIndex() {
  const { userState } = useUserStore();

  return (
    <div className={"flex h-full w-full"}>
      <div className={"bg-serverSidebar relative h-full w-72"}>
        <ServerIndexDMList />
        <UserInfoMenu />
      </div>
      <ServerIndexFriend />

      {userState.userContextMenu ? <UserContextMenu /> : null}
    </div>
  );
}
