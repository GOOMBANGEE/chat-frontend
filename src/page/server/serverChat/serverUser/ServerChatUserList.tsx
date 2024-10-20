import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useUserStore } from "../../../../store/UserStore.tsx";
import { UserInfo } from "../../../../../index";
import React, { useEffect, useState } from "react";
import { useChatStore } from "../../../../store/ChatStore.tsx";
import IconComponent from "../../../../component/IconComponent.tsx";

export default function ServerChatUserList() {
  const { serverUserListState } = useServerStore();
  const { setChatState } = useChatStore();
  const { userState, setUserState } = useUserStore();

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
      setChatState({ focusDmInput: true });
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
        "flex h-full w-80 flex-col bg-customDark_1 px-4 py-6 text-customText"
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
                "flex w-full items-center gap-x-2 rounded px-2 py-2 hover:bg-customDark_5"
              }
            >
              <IconComponent icon={userInfo.avatarImageSmall} size={10} />

              <div className={"truncate"}>{userInfo.username}</div>
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
              onClick={(e) => handleClick(e, userInfo)}
              onContextMenu={(e) => handleContextMenu(e, userInfo)}
              className={
                "flex w-full items-center gap-x-2 rounded px-2 py-2 hover:bg-customDark_5"
              }
            >
              <IconComponent icon={userInfo.avatarImageSmall} size={10} />

              <div>{userInfo.username}</div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
