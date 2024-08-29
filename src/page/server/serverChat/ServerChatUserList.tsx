import { useServerStore } from "../../../store/ServerStore.tsx";

export default function ServerChatUserList() {
  const { serverUserListState } = useServerStore();
  return (
    <div
      className={
        "bg-serverChatUserList flex h-full w-48 flex-col gap-y-2 px-4 py-6"
      }
    >
      <div className={"text-xs text-gray-400"}>참여중인 유저</div>
      {serverUserListState.map((serverUserInfo) => (
        <div key={serverUserInfo.username} className={"flex"}>
          <div>{serverUserInfo.username}</div>
        </div>
      ))}
    </div>
  );
}
