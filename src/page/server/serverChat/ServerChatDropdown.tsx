import { useServerStore } from "../../../store/ServerStore.tsx";
import { useServerChatDropdownStore } from "../../../store/ServerChatDropdownStore.tsx";
import { useEffect } from "react";

export default function ServerChatDropdown() {
  const {
    serverChatDropdownState,
    setServerDropdownState,
    resetServerDropdownState,
  } = useServerChatDropdownStore();
  const { serverState } = useServerStore();

  // dropdown 바깥쪽 클릭시 modal close
  const handleClickOutside = (e: MouseEvent) => {
    if (
      serverChatDropdownState.open &&
      !(e.target as HTMLElement).closest(".server-chat-dropdown")
    ) {
      resetServerDropdownState();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [serverChatDropdownState, setServerDropdownState]);

  return (
    <div className={"relative flex flex-col"}>
      <button
        onClick={() => setServerDropdownState({ open: true })}
        className={"w-full px-6 py-4 text-start font-semibold shadow-md"}
      >
        {serverState.name}
      </button>

      {serverChatDropdownState.open ? (
        <div
          className={
            "server-chat-dropdown absolute left-2 top-16 w-52 rounded bg-black px-2 py-4 text-gray-400"
          }
        >
          <div className={"flex flex-col"}>
            <button
              className={
                "w-full rounded px-2 py-1 text-start text-indigo-400 hover:bg-indigo-500 hover:text-white"
              }
            >
              초대하기
            </button>
            <button
              className={
                "w-full rounded px-2 py-1 text-start hover:bg-indigo-500 hover:text-white"
              }
            >
              서버 설정
            </button>
            <div className={"my-1 border border-gray-900"}></div>
            <button
              className={
                "w-full rounded px-2 py-1 text-start text-red-600 hover:bg-red-500 hover:text-white"
              }
            >
              서버 나가기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
