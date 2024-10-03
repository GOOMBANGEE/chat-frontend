import useSendChatMessage from "../../../../hook/server/serverChat/useSendChatMessage.tsx";
import { useUserStore } from "../../../../store/UserStore.tsx";
import { useChatStore } from "../../../../store/ChatStore.tsx";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import React, { useEffect, useRef } from "react";
import { Chat, ChatInfoList } from "../../../../../index";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";

export default function ChatInput() {
  const { sendChatMessage } = useSendChatMessage();

  const { serverState } = useServerStore();
  const { channelState } = useChannelStore();
  const { chatState, setChatState, chatListState, setChatListState } =
    useChatStore();
  const { userState } = useUserStore();

  const inputRef = useRef<HTMLInputElement>(null);

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
    if (userState.username && chatState.chatMessage) {
      const chat: Chat = {
        id: Date.now(),
        username: userState.username,
        avatarImageSmall: userState.avatar ? userState.avatar : undefined,
        message: chatState.chatMessage,
      };

      const newChatInfoList: ChatInfoList[] = chatListState.map(
        (chatInfoList) => {
          if (
            chatInfoList.serverId === serverState.id &&
            chatInfoList.channelId === channelState.id
          ) {
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

      sendChatMessage({ chat: chat, chatList: newChatInfoList });
    }

    setChatState({ chatMessage: undefined });
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.innerText = "";
    }
  };

  // div chat input
  const handleInput = () => {
    if (inputRef.current) {
      setChatState({
        chatMessage: inputRef.current.innerText,
      });
    }
  };

  // div input focus
  const handleBlurDivInput = () => {
    setChatState({ focusInput: false });
  };
  const handleFocusInput = () => {
    setChatState({ focusInput: true });
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatState.focusInput]);

  return (
    <div className={"relative px-6"}>
      <div className={"relative flex w-full"}>
        {chatState.focusInput ? (
          <div
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={() => handleBlurDivInput()}
            onKeyDown={(e) => handleKeyDown(e)}
            onInput={handleInput}
            className={
              "w-full overflow-hidden rounded bg-customDark_5 px-4 py-2 outline-none"
            }
          ></div>
        ) : (
          <input
            onFocus={() => handleFocusInput()}
            placeholder={`${serverState.name}에 메시지 보내기`}
            className={
              "w-full overflow-hidden rounded bg-customDark_5 px-4 py-2"
            }
          />
        )}

        <button
          className={"absolute right-2 top-1.5 rounded-full bg-indigo-500 p-1"}
          onClick={() => {
            handleClickSendButton();
          }}
        >
          <svg
            width="20px"
            height="20px"
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
