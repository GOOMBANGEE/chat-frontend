import ServerIndexDMList from "./ServerIndexDMList.tsx";
import ServerIndexFriend from "./ServerIndexFriend.tsx";
import UserInfoMenu from "../UserInfoMenu.tsx";

export default function ServerIndex() {
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
    </div>
  );
}
