import useSendChatMessage from "../../../../hook/server/serverChat/useSendChatMessage.tsx";
import { useUserStore } from "../../../../store/UserStore.tsx";
import { useChatStore } from "../../../../store/ChatStore.tsx";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import React, { ChangeEvent, useEffect, useRef } from "react";
import { Chat, ChatInfoList } from "../../../../../index";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";

export default function ChatInput() {
  const { sendChatMessage } = useSendChatMessage();

  const { serverState } = useServerStore();
  const { channelState } = useChannelStore();
  const { chatState, setChatState, chatListState, setChatListState } =
    useChatStore();
  const { userState } = useUserStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // 버튼클릭시 input 클릭하는 효과
  const handleClickFileInputButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      if (file.type.startsWith("image")) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const image = new Image();
          image.src = reader.result as string;

          image.onload = () => {
            setChatState({
              attachmentType: "image",
              attachment: reader.result as string,
              attachmentFileName: file.name,
            });
          };
        };
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // send message -> Enter key / Click send button
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleClickSendButton = () => {
    sendMessage();
  };

  const sendMessage = () => {
    if (
      userState.id &&
      userState.username &&
      (chatState.chatMessage || chatState.attachment)
    ) {
      const chat: Chat = {
        id: Date.now(),
        userId: userState.id,
        username: userState.username,
        avatarImageSmall: userState.avatar ? userState.avatar : undefined,
        message: chatState.chatMessage,
        attachment: chatState.attachment,
        attachmentWidth: chatState.attachmentWidth,
        attachmentHeight: chatState.attachmentHeight,
      };

      const newChatInfoList: ChatInfoList[] = chatListState.map(
        (chatInfoList) => {
          if (chatInfoList.channelId === channelState.id) {
            return {
              ...chatInfoList,
              chatList: [...chatInfoList.chatList, chat],
            };
          }
          return chatInfoList;
        },
      );
      setChatState({ sendMessage: true });
      setChatListState(newChatInfoList);

      if (channelState.id)
        sendChatMessage({
          serverId: serverState.id,
          channelId: channelState.id,
          chat: chat,
          chatList: newChatInfoList,
        });
    }

    setChatState({
      chatMessage: undefined,
      attachmentType: undefined,
      attachment: undefined,
      attachmentFileName: undefined,
    });
    if (chatInputRef.current) {
      chatInputRef.current.value = "";
      chatInputRef.current.innerText = "";
    }
  };

  // div chat input
  const handleChatInput = (e: React.FormEvent<HTMLDivElement>) => {
    const divElement = e.currentTarget;
    if (chatInputRef.current) {
      // html 코드가 들어오는경우 innerText와 값이 달라짐
      // innerHTML을 순수 텍스트만 남김
      if (divElement.innerHTML !== chatInputRef.current.innerText) {
        divElement.innerHTML = chatInputRef.current.innerText;
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(chatInputRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setChatState({
        chatMessage: chatInputRef.current.innerText,
      });
    }
  };

  // image paste logic
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const item = e.clipboardData?.items[0];

      if (item && item.type === "text/html") {
        item.getAsString(async (htmlString) => {
          // html에서 img 추출
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(htmlString, "text/html");
          const image = htmlDoc.querySelector("img");
          if (image?.src) {
            // fetch로 이미지 데이터를 가져와서 blob으로 변환
            const response = await fetch(image.src);
            const blob = await response.blob();

            // blob을 file로 변환
            const file = new File([blob], "pasted-image-from-html", {
              type: blob.type,
            });

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
              setChatState({
                attachmentType: "image",
                attachment: reader.result as string,
                attachmentFileName: file.name,
              });
            };
          }
        });
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className={"relative px-6"}>
      {chatState.attachment ? (
        <div
          className={
            "rounded border-b-2 border-customGray_0 bg-customDark_5 px-4 py-4"
          }
        >
          <div
            className={
              "relative flex h-60 w-60 flex-col items-center justify-center rounded bg-customDark_3 px-3 pt-4"
            }
          >
            <div className={"h-44 w-full rounded bg-customGray_0"}>
              <img
                className={"h-full w-full rounded object-contain"}
                src={chatState.attachment}
              />
            </div>
            <div className={"mt-2 flex h-6 w-full items-center truncate"}>
              {chatState.attachmentFileName}
            </div>
            <button
              onClick={() => {
                setChatState({
                  attachmentType: undefined,
                  attachment: undefined,
                  attachmentFileName: undefined,
                });
              }}
            >
              <div
                style={{ right: -10, top: -5 }}
                className={"absolute rounded bg-customDark_0 p-0.5"}
              >
                <svg
                  width="24px"
                  height="24px"
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
                      className={"stroke-red-500"}
                      d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
            </button>
          </div>
        </div>
      ) : null}

      <div className={"relative flex w-full"}>
        <div
          className={`${chatState.chatMessage ? "hidden" : "absolute"} pointer-events-none left-12 top-2 z-10 px-0.5 text-gray-500`}
        >
          {`${channelState.name}에 메시지 보내기`}
        </div>
        <div
          ref={chatInputRef}
          contentEditable
          suppressContentEditableWarning={true}
          onKeyDown={(e) => handleKeyDown(e)}
          onInput={handleChatInput}
          className={
            "custom-scrollbar max-h-56 w-full overflow-hidden overflow-y-scroll rounded bg-customDark_5 py-2 pl-12 pr-8 outline-none"
          }
        ></div>

        <div className={"absolute left-2 top-1"}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={"hidden"}
          />
          <button onClick={handleClickFileInputButton}>
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
                {" "}
                <path
                  className={"stroke-customGray_4"}
                  d="M8 12H16M12 8V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
        </div>

        <button
          className={"absolute right-2 top-1 rounded-full p-1"}
          onClick={() => {
            handleClickSendButton();
          }}
        >
          <svg
            width="24px"
            height="24px"
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
                d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}
