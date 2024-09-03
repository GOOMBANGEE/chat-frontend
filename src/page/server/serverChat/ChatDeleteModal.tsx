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

  // 채팅 시간 변환
  let formattedTime = "";
  if (chatState.createTime) {
    const createTimeToString = chatState.createTime.toLocaleString();
    const year = createTimeToString.slice(0, 4);
    const month = createTimeToString.slice(5, 7);
    const day = createTimeToString.slice(8, 10);
    let hour = Number(createTimeToString.slice(11, 13));
    const minute = createTimeToString.slice(14, 16);
    const period = hour < 12 ? "오전" : "오후";

    if (hour > 12) hour -= 12; // 12시간제로 변환

    formattedTime = `${year}.${month}.${day}. ${period} ${hour}:${minute}`;
    //    todo
    // 시간변환함수 밖으로 빼기
  }

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
            "absolute mx-4 flex flex-col rounded bg-customDark_4 text-center text-customText"
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

          <div className={"px-4"}>
            <div
              style={{ boxShadow: "0 0 1px 2px rgba(0, 0, 0, 0.2)" }}
              className={"mb-8 flex w-full rounded px-4 py-2"}
            >
              <div className={"flex flex-col"}>
                <div className={"mb-0.5 flex items-end"}>
                  <div className={"mr-2 font-semibold"}>
                    {chatState.username}
                  </div>
                  {formattedTime && (
                    <div className={"text-xs text-gray-400"}>
                      {formattedTime}
                    </div>
                  )}
                </div>
                <div className={"text-start"}>{chatState.message}</div>
              </div>
            </div>
          </div>

          <div
            className={
              "flex w-full items-center justify-end gap-4 rounded-b bg-customDark_1 px-4 py-4"
            }
          >
            <button
              onClick={() => handleClickCancelButton()}
              className={"px-4 py-2 hover:underline"}
            >
              취소
            </button>
            <button
              onClick={() => handleClickDeleteButton()}
              className={
                "rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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
