import { useEffect, useState } from "react";
import { useChatStore } from "../../../store/ChatStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import { toast } from "react-toastify";

export default function ChatContextMenu() {
  const { chatState, setChatState, resetChatState } = useChatStore();
  const { userState } = useUserStore();
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleClickEditButton = () => {
    setChatState({
      chatEdit: true,
      chatContextMenuOpen: false,
    });
  };

  const handleClickCopyButton = async () => {
    await navigator.clipboard.writeText(String(chatState.message));
    resetChatState();
    toast.success("텍스트가 복사되었습니다.");
  };

  const handleClickDeleteButton = () => {
    setChatState({
      chatDeleteModalOpen: true,
      chatContextMenuOpen: false,
    });
  };

  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        chatState.chatContextMenuOpen &&
        !(e.target as HTMLElement).closest(".server-chat-context-menu")
      ) {
        setChatState({
          id: undefined,
          username: undefined,
          message: undefined,
          chatContextMenuOpen: false,
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
  }, [chatState, setChatState]);

  return (
    <div
      style={{
        position: "fixed",
        top: `${menuPosition.y}px`,
        left: `${menuPosition.x}px`,
      }}
      className={
        "server-chat-context-menu flex flex-col gap-2 rounded bg-black px-2 py-2 text-gray-300"
      }
    >
      {chatState.username === userState.username && !chatState.enter ? (
        <button
          onClick={() => handleClickEditButton()}
          className={
            "rounded px-2 py-1 text-start text-sm hover:bg-indigo-500 hover:text-white"
          }
        >
          메시지 수정하기
        </button>
      ) : null}

      <button
        className={
          "rounded px-2 py-1 text-start text-sm hover:bg-indigo-500 hover:text-white"
        }
      >
        답장
      </button>
      <button
        onClick={() => handleClickCopyButton()}
        className={
          "rounded px-2 py-1 text-start text-sm hover:bg-indigo-500 hover:text-white"
        }
      >
        텍스트 복사하기
      </button>
      {chatState.username === userState.username && !chatState.enter ? (
        <button
          onClick={() => handleClickDeleteButton()}
          className={
            "rounded px-2 py-1 text-start text-sm text-red-500 hover:bg-red-600 hover:text-white"
          }
        >
          메시지 삭제하기
        </button>
      ) : null}
    </div>
  );
}
