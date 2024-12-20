import { Chat, ChatInfoList, ImageInfo, UserInfo } from "../../../../../index";
import { useChatStore } from "../../../../store/ChatStore.tsx";
import React, { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import { useUserStore } from "../../../../store/UserStore.tsx";
import useChatEdit from "../../../../hook/server/serverChat/useChatEdit.tsx";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import IconComponent from "../../../../component/IconComponent.tsx";
import ImageAttachment from "../../../../component/ImageAttachment.tsx";

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
  const { userState, setUserState } = useUserStore();

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
      focusUsername: props.chat.username,
      focusUserAvatarImageSmall: props.chat.avatarImageSmall,
      focusAttachment: props.chat.attachment,
      focusAttachmentWidth: props.chat.attachmentWidth,
      focusAttachmentHeight: props.chat.attachmentHeight,
    });
  };

  // 채팅 수정
  const inputRef = useRef<HTMLInputElement>(null);
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClickSaveButton();
    }
  };

  // 채팅 수정 취소 전역설정
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClickCancelButton();
      }
    };

    if (chatState.chatEdit) {
      document.addEventListener("keydown", handleKeyEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyEscape);
    };
  }, [chatState.chatEdit]);

  const handleClickCancelButton = () => {
    setChatState({ id: undefined, chatMessage: undefined, chatEdit: false });
  };

  const handleClickSaveButton = () => {
    if (
      chatState.id &&
      chatState.chatMessage &&
      userState.id &&
      userState.username
    ) {
      const chat: Chat = {
        id: chatState.id,
        userId: userState.id,
        username: userState.username,
        avatarImageSmall: userState.avatar ? userState.avatar : undefined,
        message: chatState.chatMessage,
      };
      const newChatInfoList: ChatInfoList[] = chatListState.map(
        (chatInfoList) => {
          if (chatInfoList.channelId === channelState.id) {
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

  const handleClickUser = (e: React.MouseEvent, userInfo: UserInfo) => {
    e.preventDefault();
    setUserState({
      userInfoMenu: true,
      focusUserId: userInfo.id,
      focusUsername: userInfo.username,
      focusUserAvatar: userInfo.avatarImageSmall,
      menuPositionX: e.clientX + 360,
      menuPositionY: e.clientY - 100,
    });
  };

  const handleClickLink = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    window.open(link);
  };

  const renderPage = () => {
    const imageInfo: ImageInfo = {
      link: props.chat.attachment,
      width: props.chat.attachmentWidth,
      height: props.chat.attachmentHeight,
    };

    const renderTimestamp = () =>
      props.chat.createTime ? (
        <div className="text-xs text-gray-400">
          {year}.{month}.{day}. {hour > 12 ? "오후" : "오전"}{" "}
          {hour > 12 ? hour - 12 : hour}:{minute}
        </div>
      ) : null;

    const userInfo: UserInfo = {
      id: props.chat.userId,
      username: props.chat.username,
      avatarImageSmall: props.chat.avatarImageSmall
        ? props.chat.avatarImageSmall
        : undefined,
    };

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
          <div className={"flex items-center"}>
            <div className={"font-semibold"}>{props.chat.username}</div>
            <div className={"mr-2"}>님이 입장하였습니다.</div>
            {renderTimestamp()}
          </div>
        </div>
      );
    }

    // 수정중 메시지
    if (chatState.chatEdit && chatState.id === props.chat.id) {
      return (
        <div className={"flex w-full items-start rounded py-2 pl-4"}>
          <IconComponent icon={props.chat.avatarImageSmall} size={12} />

          <div className={"ml-1 flex w-full flex-col bg-customDark_1 px-3"}>
            <div className={"mb-0.5 flex items-center"}>
              <div className={"mr-2 font-semibold"}>{props.chat.username}</div>
              {renderTimestamp()}
            </div>

            <div
              className={
                "mb-1 mt-2 flex w-full flex-col gap-1 rounded text-customText"
              }
            >
              <input
                ref={inputRef}
                onChange={(e) => setChatState({ chatMessage: e.target.value })}
                onKeyDown={(e) => handleKey(e)}
                defaultValue={chatState.message}
                className={
                  "w-full rounded bg-customDark_5 px-3 py-2 outline-none"
                }
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
              <ImageAttachment
                image={imageInfo}
                maxWidth={undefined}
                maxHeight={undefined}
              />
            </div>
          </div>
        </div>
      );
    }

    const regex = /(https?:\/\/[^\s]+)/g;
    const message = props.chat.message?.split(regex);

    // 일반 메시지
    return (
      <div
        ref={ref}
        style={{ minHeight: props.chat.attachment ? "auto" : "none" }}
        className={
          "flex w-full select-text rounded px-4 py-2 hover:bg-customDark_1"
        }
      >
        <IconComponent
          onClick={(e) => handleClickUser(e, userInfo)}
          icon={props.chat.avatarImageSmall}
          size={12}
        />
        <div
          onContextMenu={(e) => handleContextMenu(e)}
          className={
            "flex w-full flex-col items-start gap-1 rounded px-4 text-customText"
          }
        >
          <div className={"flex flex-col"}>
            <div className={"mb-0.5 flex items-center"}>
              <div
                onClick={(e) => handleClickUser(e, userInfo)}
                className={
                  "mr-2 font-semibold hover:cursor-pointer hover:underline"
                }
              >
                {props.chat.username}
              </div>
              {renderTimestamp()}
            </div>

            <div className={"flex"}>
              <div className={"mb-1 flex w-full"}>
                <div
                  style={{
                    maxWidth: `${serverState.serverUserList || serverState.searchList ? "calc(100vw - 900px)" : "calc(100vw - 480px)"}`,
                  }}
                  className={`${props.chat.error ? "text-red-600" : ""} mr-2 break-words`}
                >
                  {message?.map((message, index) =>
                    message.match(regex) ? (
                      <span
                        key={index}
                        onClick={(e) => handleClickLink(e, message)}
                        className={"cursor-pointer text-blue-500"}
                      >
                        {message}
                      </span>
                    ) : (
                      message
                    ),
                  )}
                  {props.chat.createTime !== props.chat.updateTime ? (
                    <span
                      className={"ml-1 align-baseline text-xs text-gray-400"}
                    >
                      (수정됨)
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <ImageAttachment
            image={imageInfo}
            maxWidth={undefined}
            maxHeight={undefined}
          />
        </div>
      </div>
    );
  };

  return renderPage();
});
