import { useEffect, useState } from "react";
import { useUserStore } from "../../store/UserStore.tsx";
import useFriendRequest from "../../hook/user/useFriendRequest.tsx";
import useFriendDelete from "../../hook/user/useFriendDelete.tsx";

export default function UserContextMenu() {
  const { friendRequest } = useFriendRequest();
  const { friendDelete } = useFriendDelete();
  const { userState, setUserState, userFriendListState } = useUserStore();
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const friend = userFriendListState.some(
    (user) => user.id === userState.focusUserId,
  );

  const handleClickFriendRequestButton = async () => {
    await friendRequest();
  };

  const handleClickFriendDeleteButton = async () => {
    await friendDelete();
    setUserState({
      userContextMenu: false,
      focusUserId: undefined,
      focusUsername: undefined,
    });
  };

  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userState.userContextMenu &&
        !(e.target as HTMLElement).closest(
          ".server-chat-user-list-context-menu",
        )
      ) {
        setUserState({
          userContextMenu: false,
          focusUserId: undefined,
          focusUsername: undefined,
        });
      }
    };
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mouseup", handleClickOutside);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [userState, setUserState]);

  return (
    <div
      style={{
        position: "fixed",
        top: `${menuPosition.y}px`,
        left: `${menuPosition.x - 120}px`,
      }}
      className={
        "server-chat-user-list-context-menu flex flex-col gap-2 rounded bg-black px-2 py-2 text-gray-300"
      }
    >
      {friend ? (
        <button
          onClick={() => handleClickFriendDeleteButton()}
          className={
            "rounded px-2 py-1 text-start text-sm hover:bg-indigo-500 hover:text-white"
          }
        >
          친구 삭제하기
        </button>
      ) : (
        <button
          onClick={() => handleClickFriendRequestButton()}
          className={
            "rounded px-2 py-1 text-start text-sm hover:bg-indigo-500 hover:text-white"
          }
        >
          친구 추가하기
        </button>
      )}
    </div>
  );
}
