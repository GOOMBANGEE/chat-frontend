import { useChatStore } from "../../../store/ChatStore.tsx";

export default function ServerChatSearchList() {
  const { chatSearchListState } = useChatStore();

  return (
    <div
      className={
        "flex h-full w-72 flex-col gap-y-2 bg-serverChatUserList px-4 py-6"
      }
    >
      <div className={"text-xs text-gray-400"}>결과</div>
      {chatSearchListState.map((chat) => (
        <div
          key={chat.id}
          className={
            "bg- flex flex-col rounded bg-defaultBackground px-2 py-1 text-start"
          }
        >
          <div>{chat.username}</div>
          <div>{chat.message}</div>
        </div>
      ))}
    </div>
  );
}
