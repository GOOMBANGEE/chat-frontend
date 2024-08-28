import { Chat } from "../../../../index";
import { useChatStore } from "../../../store/ChatStore.tsx";
import React, { useEffect, useRef } from "react";
import { useUserStore } from "../../../store/UserStore.tsx";
import useChatEdit from "../../../hook/server/serverChat/useChatEdit.tsx";

interface Props {
  chat: Chat;
}

export default function ChatComponent(props: Readonly<Props>) {
  const { chatEdit } = useChatEdit();
  const { chatState, setChatState, chatListState, setChatListState } =
    useChatStore();
  const { userState } = useUserStore();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setChatState({
      id: props.chat.id,
      username: props.chat.username,
      message: props.chat.message,
      chatContextMenuOpen: true,
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClickSaveButton();
    }
    if (e.key === "Escape") {
      handleClickCancelButton();
    }
  };

  const handleClickCancelButton = () => {
    setChatState({ id: undefined, chatMessage: undefined, chatEdit: false });
  };

  const handleClickSaveButton = () => {
    if (userState.username && chatState.id && chatState.chatMessage) {
      const chat: Chat = {
        id: chatState.id,
        username: userState.username,
        message: chatState.chatMessage,
      };
      const newChatList = chatListState.map((chat) => {
        if (chat.id === chatState.id && chatState.chatMessage) {
          return { ...chat, message: chatState.chatMessage };
        }
        return chat;
      });
      setChatListState(newChatList);

      chatEdit({ chat: chat, chatList: newChatList });
    }

    setChatState({ chatMessage: undefined });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setChatState({ chatEdit: false });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatState.chatEdit]);

  return (
    <>
      {chatState.chatEdit && chatState.id === props.chat.id ? (
        <div className={"mb-1 mt-1 flex flex-col"}>
          <input
            ref={inputRef}
            onChange={(e) => setChatState({ chatMessage: e.target.value })}
            onKeyDown={(e) => handleKey(e)}
            defaultValue={chatState.message}
            className={"w-full rounded bg-customGray px-4 py-2"}
          />
          <div className={"flex items-center text-xs"}>
            <div>
              Esc 키로{" "}
              <button
                className={"mr-1 text-blue-500 hover:underline"}
                onClick={() => handleClickCancelButton()}
              >
                취소
              </button>
            </div>
            <div>
              • Enter 키로{" "}
              <button
                className={"mr-1 text-blue-500 hover:underline"}
                onClick={() => handleClickSaveButton()}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onContextMenu={(e) => handleContextMenu(e)}
          className={"flex gap-2 rounded hover:bg-customDarkGray"}
        >
          <div className={"font-semibold"}>{props.chat.username} :</div>
          <div
            className={`${props.chat.error ? "text-red-600" : "text-white"}`}
          >
            {props.chat.message}
          </div>
        </div>
      )}
    </>
  );
}
