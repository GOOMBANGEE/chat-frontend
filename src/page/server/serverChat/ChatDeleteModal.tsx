import { useEffect } from "react";
import { useChatStore } from "../../../store/ChatStore.tsx";
import useChatDelete from "../../../hook/server/serverChat/useChatDelete.tsx";

export default function ChatDeleteModal() {
  const { chatDelete } = useChatDelete();
  const { chatState, resetChatState } = useChatStore();
  const handleClickCancelButton = () => {
    resetChatState();
  };

  const handleClickDeleteButton = async () => {
    await chatDelete();
    resetChatState();
  };

  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        chatState.chatDeleteModalOpen &&
        !(e.target as HTMLElement).closest(".server-chat-delete-modal")
      ) {
        handleClickCancelButton();
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [chatState, resetChatState]);

  return (
    <div
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-gray-700 opacity-50"}></div>
      <div
        className={
          "server-chat-delete-modal z-10 flex items-center justify-center"
        }
      >
        <div
          style={{ width: "450px" }}
          className={
            "absolute mx-4 flex flex-col rounded bg-modalGray text-center"
          }
        >
          <div
            className={"px-4 py-4 text-start text-xl font-semibold text-white"}
          >
            메시지 삭제하기
          </div>
          <div className={"mb-4 px-4 text-start"}>
            정말 이 메시지를 삭제할까요?
          </div>

          <div className={"mb-4 flex w-full rounded px-4 py-2"}>
            <div className={"mr-2 font-semibold"}>{chatState.username} :</div>
            <div>{chatState.message}</div>
          </div>

          <div
            style={{ backgroundColor: "#1D2125" }}
            className={
              "flex w-full items-center justify-end gap-4 rounded-b px-4 py-4"
            }
          >
            <button
              onClick={() => handleClickCancelButton()}
              className={"px-4 py-2 text-white hover:underline"}
            >
              취소
            </button>
            <button
              onClick={() => handleClickDeleteButton()}
              className={
                "rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              }
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
