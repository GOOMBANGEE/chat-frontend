import ServerIndexDMList from "./ServerIndexDMList.tsx";
import ServerIndexFriend from "./ServerIndexFriend.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import UserContextMenu from "../UserContextMenu.tsx";
import UserInfoMenu from "../UserInfoMenu.tsx";

export default function ServerIndex() {
  const { userState } = useUserStore();

  return (
    <div className={"flex h-full w-full"}>
      <div
        style={{ width: "240px" }}
        className={"relative h-full bg-customDark_2"}
      >
        <ServerIndexDMList />
        <UserInfoMenu />
      </div>
      <ServerIndexFriend />

      {userState.userContextMenu ? <UserContextMenu /> : null}
    </div>
  );
}
