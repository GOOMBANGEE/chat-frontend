import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useUserStore } from "../../../../store/UserStore.tsx";
import { UserInfo } from "../../../../../index";
import React, { useEffect, useState } from "react";
import { useEnvStore } from "../../../../store/EnvStore.tsx";

export default function ServerChatUserList() {
  const { envState } = useEnvStore();
  const { userState, setUserState } = useUserStore();
  const { serverUserListState } = useServerStore();

  const [onlineUser, setOnlineUser] = useState<UserInfo[]>();
  const [offlineUser, setOfflineUser] = useState<UserInfo[]>();

  const handleClick = (e: React.MouseEvent, userInfo: UserInfo) => {
    e.preventDefault();
    if (userInfo.id !== userState.id)
      setUserState({
        userInfoMenu: true,
        focusUserId: userInfo.id,
        focusUsername: userInfo.username,
        focusUserAvatar: userInfo.avatarImageSmall,
        menuPositionX: e.clientX,
        menuPositionY: e.clientY,
      });
  };

  const handleContextMenu = (e: React.MouseEvent, userInfo: UserInfo) => {
    e.preventDefault();
    if (userInfo.id !== userState.id) {
      setUserState({
        userContextMenu: true,
        focusUserId: userInfo.id,
        focusUsername: userInfo.username,
        focusUserAvatar: userInfo.avatarImageSmall,
        menuPositionX: e.clientX,
        menuPositionY: e.clientY,
      });
    }
  };

  useEffect(() => {
    const onlineUserList = serverUserListState.filter((userInfo: UserInfo) => {
      return userInfo.online;
    });
    const offlineUserList = serverUserListState.filter((userInfo: UserInfo) => {
      return !userInfo.online;
    });

    setOnlineUser(onlineUserList);
    setOfflineUser(offlineUserList);
  }, [serverUserListState]);

  return (
    <div
      className={
        "flex h-full w-96 flex-col bg-customDark_1 px-4 py-6 text-customText"
      }
    >
      {onlineUser && onlineUser.length !== 0 ? (
        <div>
          <div className={"mb-1 text-sm font-semibold text-gray-400"}>
            온라인 — {onlineUser.length}
          </div>
          {onlineUser.map((userInfo) => (
            <button
              key={userInfo.id}
              onClick={(e) => handleClick(e, userInfo)}
              onContextMenu={(e) => handleContextMenu(e, userInfo)}
              className={
                "flex w-full items-center rounded px-2 py-2 hover:bg-customDark_5"
              }
            >
              {userInfo.avatarImageSmall ? (
                <img
                  className={"mr-2 h-10 w-10 rounded-full"}
                  src={envState.baseUrl + userInfo.avatarImageSmall}
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
              <div>{userInfo.username}</div>
            </button>
          ))}
        </div>
      ) : null}
      {offlineUser && offlineUser.length !== 0 ? (
        <div>
          <div className={"mb-1 text-sm font-semibold text-gray-400"}>
            오프라인 — {offlineUser.length}
          </div>
          {offlineUser.map((userInfo) => (
            <button
              key={userInfo.id}
              onContextMenu={(e) => handleContextMenu(e, userInfo)}
              className={
                "flex w-full items-center rounded px-2 py-2 hover:bg-customDark_5"
              }
            >
              {userInfo.avatarImageSmall ? (
                <img
                  className={"mr-2 h-10 w-10 rounded-full"}
                  src={envState.baseUrl + userInfo.avatarImageSmall}
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
              <div>{userInfo.username}</div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
