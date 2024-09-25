import { useEffect, useState } from "react";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";

export default function ServerChatCategoryChannelContextMenu() {
  const { serverState, setServerState } = useServerStore();
  const { setCategoryState } = useCategoryStore();
  const { setChannelState } = useChannelStore();
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleClickChannelCreateButton = () => {
    setChannelState({ createModalOpen: true });
    setServerState({
      categoryChannelContextMenu: false,
    });
  };

  const handleClickCategoryCreateButton = () => {
    setCategoryState({ createModalOpen: true });
    setServerState({
      categoryChannelContextMenu: false,
    });
  };

  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        serverState.categoryChannelContextMenu &&
        !(e.target as HTMLElement).closest(
          ".server-chat-category-channel-list-context-menu",
        )
      ) {
        setServerState({
          categoryChannelContextMenu: false,
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
  }, [serverState, setServerState]);

  return (
    <div
      style={{
        position: "fixed",
        top: `${menuPosition.y}px`,
        left: `${menuPosition.x}px`,
      }}
      className={
        "server-chat-category-channel-list-context-menu flex flex-col gap-2 rounded bg-black px-2 py-2 text-customText text-gray-300"
      }
    >
      <button
        onClick={handleClickChannelCreateButton}
        className={
          "rounded px-2 py-1 text-start text-sm hover:bg-indigo-500 hover:text-white"
        }
      >
        채널 만들기
      </button>
      <button
        onClick={handleClickCategoryCreateButton}
        className={
          "rounded px-2 py-1 text-start text-sm hover:bg-indigo-500 hover:text-white"
        }
      >
        카테고리 만들기
      </button>
    </div>
  );
}
