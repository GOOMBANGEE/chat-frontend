import { useServerStore } from "../../../store/ServerStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import { UserInfo } from "../../../../index";
import React from "react";
import { useEnvStore } from "../../../store/EnvStore.tsx";

export default function ServerChatUserList() {
  const { envState } = useEnvStore();
  const { userState, setUserState } = useUserStore();
  const { serverUserListState } = useServerStore();
  const baseUrl = envState.baseUrl;

  const handleContextMenu = (e: React.MouseEvent, userInfo: UserInfo) => {
    e.preventDefault();
    if (userInfo.id !== userState.id) {
      setUserState({
        userContextMenu: true,
        focusUserId: userInfo.id,
        focusUsername: userInfo.username,
      });
    }
  };

  return (
    <div
      className={
        "flex h-full w-96 flex-col bg-customDark_1 px-4 py-6 text-customText"
      }
    >
      <div className={"mb-1 text-xs text-gray-400"}>참여중인 유저</div>
      {serverUserListState.map((serverUserInfo) => (
        <button
          key={serverUserInfo.id}
          onContextMenu={(e) => handleContextMenu(e, serverUserInfo)}
          className={
            "flex w-full items-center rounded px-2 py-2 hover:bg-customDark_5"
          }
        >
          {serverUserInfo.avatarImageSmall ? (
            <img
              className={"mr-2 h-10 w-10 rounded-full"}
              src={baseUrl + serverUserInfo.avatarImageSmall}
            />
          ) : (
            <svg
              className={"mr-2 w-10"}
              width="32px"
              height="32px"
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
                  d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  className={"stroke-customGray_4"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          )}
          <div>{serverUserInfo.username}</div>
        </button>
      ))}
    </div>
  );
}
