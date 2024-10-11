import React, { useEffect, useRef } from "react";
import { useUserStore } from "../../../../store/UserStore.tsx";
import { useEnvStore } from "../../../../store/EnvStore.tsx";
import { Chat, ChatInfoList } from "../../../../../index";
import useSendChatMessage from "../../../../hook/server/serverChat/useSendChatMessage.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import { useChatStore } from "../../../../store/ChatStore.tsx";

export default function ServerUserInfoMenu() {
  const { sendChatMessage } = useSendChatMessage();

  const { channelState } = useChannelStore();
  const { chatState, setChatState, chatListState, setChatListState } =
    useChatStore();
  const { userState, setUserState } = useUserStore();
  const { envState } = useEnvStore();

  const chatInputRef = useRef<HTMLInputElement>(null);

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
    if (userState.username && (chatState.chatMessage || chatState.attachment)) {
      const chat: Chat = {
        id: Date.now(),
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

      sendChatMessage({ chat: chat, chatList: newChatInfoList });
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

  // div input focus
  const handleFocusChatInput = () => {
    setChatState({ focusDmInput: true });
  };
  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [chatState.focusDmInput]);

  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userState.userInfoMenu &&
        !(e.target as HTMLElement).closest(
          ".server-chat-serverUser-list-user-info-menu",
        )
      ) {
        setUserState({
          userInfoMenu: false,
          focusUserId: undefined,
          focusUsername: undefined,
          menuPositionX: undefined,
          menuPositionY: undefined,
        });
        setChatState({
          focusDmInput: false,
        });
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [userState, setUserState]);

  return (
    <div
      style={{
        position: "fixed",
        top: `${userState.menuPositionY}px`,
        ...(location.pathname !== "/server" && userState.menuPositionX
          ? { left: `${userState.menuPositionX - 320}px` }
          : { left: `${userState.menuPositionX}px` }),
      }}
      className={
        "server-chat-serverUser-list-user-info-menu flex w-80 flex-col gap-6 rounded bg-customDark_0 px-4 py-4 text-customText"
      }
    >
      <div className={"flex items-center gap-4"}>
        {userState.focusUserAvatar ? (
          <img
            className={"h-12 w-12 rounded-full"}
            src={envState.baseUrl + userState.focusUserAvatar}
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
        <div className={"text-lg font-semibold"}>{userState.focusUsername}</div>
      </div>
      <div className={"relative flex w-full"}>
        {chatState.focusDmInput ? (
          <div
            ref={chatInputRef}
            contentEditable
            suppressContentEditableWarning={true}
            onKeyDown={(e) => handleKeyDown(e)}
            onInput={handleChatInput}
            className={
              "custom-scrollbar max-h-56 w-full overflow-hidden overflow-y-scroll rounded bg-customDark_5 py-2 pl-4 pr-4 outline-none"
            }
          ></div>
        ) : (
          <input
            onFocus={() => handleFocusChatInput()}
            placeholder={`${userState.focusUsername}님에게 메시지 보내기`}
            className={
              "w-full overflow-hidden rounded bg-customDark_5 py-2 pl-4 pr-4"
            }
          />
        )}

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
