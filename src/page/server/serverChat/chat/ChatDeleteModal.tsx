import { useEffect } from "react";
import { useChatStore } from "../../../../store/ChatStore.tsx";
import useChatDelete from "../../../../hook/server/serverChat/useChatDelete.tsx";
import { useEnvStore } from "../../../../store/EnvStore.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import { Chat, ChatInfoList } from "../../../../../index";

export default function ChatDeleteModal() {
  const { chatDelete } = useChatDelete();
  const { channelState } = useChannelStore();
  const { chatState, chatListState, setChatListState, resetChatState } =
    useChatStore();
  const { envState } = useEnvStore();

  const handleClickCancelButton = () => {
    resetChatState();
  };

  const handleClickDeleteButton = async () => {
    // chatListState에서 해당 chatId를 찾아서, error인 chat이라면 server요청을 하지않고 삭제
    const chatList = chatListState.find((chatInfoList) => {
      if (chatInfoList.channelId === channelState.id) {
        return chatInfoList;
      }
    });
    const chat = chatList?.chatList.find((chatInfo) => {
      if (chatInfo.id === chatState.id) {
        return chatInfo;
      }
    });

    if (chat?.error) {
      const newChatList: ChatInfoList[] = chatListState.map((chatInfo) => {
        return {
          ...chatInfo,
          chatList: chatInfo.chatList.filter(
            (chat: Chat) => chat.id !== chatState.id,
          ),
        };
      });
      setChatListState(newChatList);
      resetChatState();
      return;
    }

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
              className={"mb-8 flex w-full gap-x-4 rounded px-4 py-2"}
            >
              {chatState.focusUserAvatarImageSmall ? (
                <img
                  className={"h-12 w-12 rounded-full"}
                  src={envState.baseUrl + chatState.focusUserAvatarImageSmall}
                />
              ) : (
                <div
                  className={
                    "flex h-12 w-12 items-center justify-center rounded-full bg-customDark_5"
                  }
                >
                  <svg
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
                </div>
              )}
              <div className={"flex flex-col"}>
                <div className={"mb-2 flex items-end"}>
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
                {chatState.focusAttachment ? (
                  <img
                    src={envState.baseUrl + chatState.focusAttachment}
                    className={"rounded"}
                  />
                ) : null}
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
