import { useServerStore } from "../../../store/ServerStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import { UserInfo } from "../../../../index";
import React from "react";

export default function ServerChatUserList() {
  const { userState, setUserState } = useUserStore();
  const { serverUserListState } = useServerStore();

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
        "flex h-full w-48 flex-col bg-customDark_1 px-4 py-6 text-customText"
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
          <div>{serverUserInfo.username}</div>
        </button>
      ))}
    </div>
  );
}
