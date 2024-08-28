import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useServerChatDropdownStore } from "../../../../store/ServerChatDropdownStore.tsx";
import { useEffect } from "react";

export default function ServerChatDropdown() {
  const {
    serverChatDropdownState,
    setServerChatDropdownState,
    resetServerDropdownState,
  } = useServerChatDropdownStore();
  const { serverState } = useServerStore();
  const { setServerState } = useServerStore();

  const handleClickOpenButton = () => {
    if (serverChatDropdownState.open) {
      setServerChatDropdownState({ open: false });
    } else {
      setServerChatDropdownState({ open: true });
    }
  };

  const handleClickInviteButton = () => {
    setServerChatDropdownState({ open: false });
    setServerState({ inviteModalOpen: true });
  };

  const handleClickSettingButton = () => {
    setServerState({ settingModalOpen: true, settingDefault: true });
  };

  // dropdown 바깥쪽 클릭시 modal close
  const handleClickOutside = (e: MouseEvent) => {
    if (
      serverChatDropdownState.open &&
      !(e.target as HTMLElement).closest(".server-serverChat-dropdown") &&
      !(e.target as HTMLElement).closest(".server-serverChat-open-button")
    ) {
      resetServerDropdownState();
    }
  };
  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [serverChatDropdownState, setServerChatDropdownState]);

  return (
    <div className={"relative flex flex-col"}>
      <button
        onClick={() => handleClickOpenButton()}
        className={
          "server-serverChat-open-button flex w-full items-center px-6 py-3 text-start font-semibold shadow-md hover:bg-customGray"
        }
      >
        {serverState.name}

        {serverChatDropdownState.open ? (
          <svg
            className={"ml-auto"}
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        ) : (
          <svg
            className={"ml-auto"}
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M6 9L12 15L18 9"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        )}
      </button>

      {serverChatDropdownState.open ? (
        <div
          className={
            "server-serverChat-dropdown absolute left-2 top-14 w-48 rounded bg-black px-2 py-4 text-gray-400"
          }
        >
          <div className={"flex flex-col"}>
            <button
              onClick={() => handleClickInviteButton()}
              className={
                "w-full rounded px-2 py-1 text-start text-indigo-400 hover:bg-indigo-500 hover:text-white"
              }
            >
              초대하기
            </button>
            <button
              onClick={() => handleClickSettingButton()}
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
