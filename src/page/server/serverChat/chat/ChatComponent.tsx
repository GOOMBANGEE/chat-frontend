import { Chat, ChatInfoList } from "../../../../../index";
import { useChatStore } from "../../../../store/ChatStore.tsx";
import React, { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import { useUserStore } from "../../../../store/UserStore.tsx";
import useChatEdit from "../../../../hook/server/serverChat/useChatEdit.tsx";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";

interface Props {
  chat: Chat;
  leastFetchChatId: number;
  lastReadMessageId: number | null | undefined;
}

export default forwardRef(function ChatComponent(
  props: Readonly<Props>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { chatEdit } = useChatEdit();
  const { serverState } = useServerStore();
  const { channelState } = useChannelStore();
  const { chatState, setChatState, chatListState, setChatListState } =
    useChatStore();
  const { userState } = useUserStore();

  // 시간 편집
  const createTimeToString = props.chat.createTime?.toLocaleString();
  const year = createTimeToString?.slice(0, 4);
  const month = createTimeToString?.slice(5, 7);
  const day = createTimeToString?.slice(8, 10);
  const hour = Number(createTimeToString?.slice(11, 13));
  const minute = createTimeToString?.slice(14, 16);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setChatState({
      id: props.chat.id,
      username: props.chat.username,
      message: props.chat.message,
      chatContextMenuOpen: true,
      chatEdit: false,
      enter: props.chat.enter,
      createTime: props.chat.createTime,
      updateTime: props.chat.updateTime,
    });
  };

  // 채팅 수정
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
      const newChatInfoList: ChatInfoList[] = chatListState.map(
        (chatInfoList) => {
          if (
            chatInfoList.serverId === serverState.id &&
            chatInfoList.channelId === channelState.id
          ) {
            return {
              ...chatInfoList,
              chatList: chatInfoList.chatList.map((chat: Chat) => {
                if (chat.id === chatState.id && chatState.chatMessage) {
                  return {
                    ...chat,
                    message: chatState.chatMessage,
                    updateTime: Date.now(),
                  };
                }
                return chat;
              }),
            };
          }
          return chatInfoList;
        },
      );
      setChatListState(newChatInfoList);

      chatEdit({ chat: chat, chatInfoList: newChatInfoList });
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

  const renderPage = () => {
    // 수정중 메시지
    if (chatState.chatEdit && chatState.id === props.chat.id) {
      return (
        <div
          className={
            "mb-2 mt-2 flex flex-col rounded bg-customDark_1 px-4 py-2 text-customText"
          }
        >
          <div className={"mb-0.5 flex items-end"}>
            <div className={"mr-2 font-semibold"}>{props.chat.username}</div>
            {props.chat.createTime ? (
              <div className={"text-xs text-gray-400"}>
                {year}.{month}.{day}. {hour > 12 ? "오후" : "오전"}{" "}
                {hour > 12 ? hour - 12 : hour}:{minute}
              </div>
            ) : null}
          </div>
          <input
            ref={inputRef}
            onChange={(e) => setChatState({ chatMessage: e.target.value })}
            onKeyDown={(e) => handleKey(e)}
            defaultValue={chatState.message}
            className={"w-full rounded bg-customDark_5 px-3 py-2 outline-none"}
          />
          <div className={"mt-1 flex items-center text-xs"}>
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
      );
    }

    // 입장 메시지
    if (props.chat.enter) {
      return (
        <div
          ref={ref}
          onContextMenu={(e) => handleContextMenu(e)}
          className={
            "mb-2 flex gap-2 rounded px-4 text-customText hover:bg-customDark_1"
          }
        >
          <div className={"flex items-end"}>
            <div className={"font-semibold"}>{props.chat.username}</div>
            <div className={"mr-2"}>님이 입장하였습니다.</div>
            {props.chat.createTime ? (
              <div className={"text-xs text-gray-400"}>
                {year}.{month}.{day}. {hour > 12 ? "오후" : "오전"}{" "}
                {hour > 12 ? hour - 12 : hour}:{minute}
              </div>
            ) : null}
          </div>{" "}
        </div>
      );
    }

    // 일반 메시지
    return (
      <div ref={ref} className={"flex flex-col"}>
        <div
          onContextMenu={(e) => handleContextMenu(e)}
          className={
            "mb-2 flex flex-col gap-2 rounded px-4 text-customText hover:bg-customDark_1"
          }
        >
          <div className={"flex flex-col"}>
            <div className={"mb-0.5 flex items-end"}>
              <div className={"mr-2 font-semibold"}>{props.chat.username}</div>
              {props.chat.createTime ? (
                <div className={"text-xs text-gray-400"}>
                  {year}.{month}.{day}. {hour > 12 ? "오후" : "오전"}{" "}
                  {hour > 12 ? hour - 12 : hour}:{minute}
                </div>
              ) : null}
            </div>

            <div className={"flex items-end"}>
              <div className={`${props.chat.error ? "text-red-600" : ""} mr-2`}>
                {props.chat.message}
              </div>
              <div className={"text-xs text-gray-400"}>
                {props.chat.createTime !== props.chat.updateTime
                  ? "(수정됨)"
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderPage();
});
