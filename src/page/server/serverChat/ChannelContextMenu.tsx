import { useEffect, useState } from "react";
import { useChannelStore } from "../../../store/ChannelStore.tsx";

export default function ChannelContextMenu() {
  const { channelState, setChannelState } = useChannelStore();
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleClickSettingButton = () => {
    setChannelState({
      contextMenu: false,
      settingModalOpen: true,
      settingDefault: true,
    });
  };

  const handleClickDeleteButton = () => {
    setChannelState({
      deleteModalOpen: true,
      contextMenu: false,
    });
  };

  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        channelState.contextMenu &&
        !(e.target as HTMLElement).closest(".channel-context-menu")
      ) {
        setChannelState({
          id: undefined,
          contextMenu: false,
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
  }, [channelState, setChannelState]);

  return (
    <div
      style={{
        top: `${Math.min(menuPosition.y, window.innerHeight - 160)}px`,
        left: `${Math.min(menuPosition.x, window.innerWidth - 150)}px`,
      }}
      className={
        "channel-context-menu fixed flex flex-col gap-2 rounded bg-black px-2 py-2 text-gray-300"
      }
    >
      <button
        onClick={handleClickSettingButton}
        className={
          "rounded px-2 py-1 text-start text-sm hover:bg-indigo-500 hover:text-white"
        }
      >
        채널 편집
      </button>
      <button
        onClick={handleClickDeleteButton}
        className={
          "rounded px-2 py-1 text-start text-sm text-red-500 hover:bg-red-600 hover:text-white"
        }
      >
        채널 삭제하기
      </button>
    </div>
  );
}
