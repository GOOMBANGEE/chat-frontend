import ServerIndexDMList from "./ServerIndexDMList.tsx";
import ServerIndexFriend from "./ServerIndexFriend.tsx";

export default function ServerIndex() {
  return (
    <div className={"flex h-full w-full"}>
      <ServerIndexDMList />
      <ServerIndexFriend />
    </div>
  );
}
