import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useEffect } from "react";
import useFetchServerInviteCode from "../../../../hook/server/serverChat/serverChatDropdown/useFetchServerInviteCode.tsx";

export default function ServerInviteModal() {
  const { fetchServerInviteCode } = useFetchServerInviteCode();
  const { serverState, setServerState } = useServerStore();

  const copyLink = async () => {
    await navigator.clipboard.writeText(String(serverState.inviteLink));
    setServerState({ inviteLinkCopy: true });

    setTimeout(() => {
      setServerState({ inviteLinkCopy: false });
    }, 1000);
  };

  useEffect(() => {
    fetchServerInviteCode();
  }, []);

  // modal 바깥쪽 클릭시 modal close
  const handleClickOutside = (e: MouseEvent) => {
    if (
      serverState.inviteModalOpen &&
      !(e.target as HTMLElement).closest(".server-invite-modal")
    ) {
      setServerState({ inviteModalOpen: false });
    }
  };
  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [serverState, setServerState]);

  return (
    <div
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-gray-700 opacity-50"}></div>
      <div className={"server-invite-modal flex items-center justify-center"}>
        <div
          style={{ width: "450px" }}
          className={
            "absolute mx-4 flex flex-col rounded bg-modalGray text-center"
          }
        >
          <button
            className={"absolute right-4 top-4 z-10 ml-auto"}
            onClick={() => {
              setServerState({ inviteModalOpen: false });
            }}
          >
            <svg
              width="24px"
              height="24px"
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
          </button>
          <div
            className={
              "relative flex items-center px-4 py-4 text-start font-semibold text-white"
            }
          >
            친구를 {serverState.name} 그룹으로 초대하기
          </div>
          {/*<FriendList/>*/}

          <div
            style={{ backgroundColor: "#1D2125" }}
            className={"flex w-full flex-col rounded-b px-4 py-4"}
          >
            <div
              className={"mb-2 text-start text-xs font-semibold text-gray-400"}
            >
              또는 친구에게 서버 초대 링크 전송하기
            </div>
            <div
              className={
                "flex w-full items-center rounded bg-customDarkGray py-1"
              }
            >
              <div className={"ml-2"}>{serverState.inviteLink}</div>
              {serverState.inviteLinkCopy ? (
                <button
                  onClick={() => copyLink()}
                  className={
                    "ml-auto mr-1 w-20 rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  }
                >
                  복사됨
                </button>
              ) : (
                <button
                  onClick={() => copyLink()}
                  className={
                    "ml-auto mr-1 w-20 rounded bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-600"
                  }
                >
                  복사
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
