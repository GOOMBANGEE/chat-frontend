import React, { useEffect, useRef } from "react";
import { useUserStore } from "../../../../store/UserStore.tsx";
import { ChannelInfo, Chat, ChatInfoList } from "../../../../../index";
import useSendChatMessage from "../../../../hook/server/serverChat/useSendChatMessage.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import { useChatStore } from "../../../../store/ChatStore.tsx";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import useChannelCreate from "../../../../hook/server/serverChat/channel/useChannelCreate.tsx";
import IconComponent from "../../../../component/IconComponent.tsx";

export default function ServerUserInfoMenu() {
  const { channelCreate } = useChannelCreate();
  const { sendChatMessage } = useSendChatMessage();

  const { resetServerState } = useServerStore();
  const { resetCategoryState } = useCategoryStore();
  const { setChannelState, resetChannelState, directMessageChannelListState } =
    useChannelStore();
  const { chatState, setChatState, chatListState, setChatListState } =
    useChatStore();
  const { userState, setUserState } = useUserStore();
  const navigate = useNavigate();

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

  const sendMessage = async () => {
    if (userState.username && chatState.chatMessage) {
      const chat: Chat = {
        id: Date.now(),
        username: userState.username,
        avatarImageSmall: userState.avatar ? userState.avatar : undefined,
        message: chatState.chatMessage,
      };

      const channel = directMessageChannelListState.find(
        (channel: ChannelInfo) =>
          channel.userDirectMessageId === userState.focusUserId,
      );

      let channelId;
      // 해당되는 channel이 없는경우 channelCreate 실행
      if (channel) {
        channelId = channel.id;
      } else {
        // channelCreate하고난 다음 response로 받은 channelId를 통해서 아래 로직 실행
        channelId = await channelCreate({
          serverId: undefined,
          userId: userState.focusUserId,
        });
      }

      // 해당되는 채널ID 수집 후 해당 채널에 추가
      const newChatInfoList: ChatInfoList[] = chatListState.map(
        (chatInfoList) => {
          if (chatInfoList.channelId === channelId) {
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

      sendChatMessage({
        channelId: channelId,
        chat: chat,
        chatList: newChatInfoList,
      });

      resetServerState();
      resetCategoryState();
      resetChannelState();
      setUserState({
        userInfoMenu: false,
        focusUserId: undefined,
        focusUsername: undefined,
        menuPositionX: undefined,
        menuPositionY: undefined,
      });
      setChannelState({ id: channelId });
      navigate(`/server/dm/${channelId}`);
    }

    setChatState({
      chatMessage: undefined,
    });
    if (chatInputRef.current) {
      chatInputRef.current.value = "";
      chatInputRef.current.innerText = "";
    }
  };

  // div chat input
  const handleChatInput = () => {
    if (chatInputRef.current) {
      setChatState({
        chatMessage: chatInputRef.current.innerText,
      });
    }
  };

  // div input focus
  useEffect(() => {
    if (chatInputRef.current && userState.focusUserId) {
      chatInputRef.current.focus();
    }
  }, [userState.focusUserId]);

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
          chatMessage: undefined,
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
        <IconComponent icon={userState.focusUserAvatar} size={12} />

        <div className={"text-lg font-semibold"}>{userState.focusUsername}</div>
      </div>
      <div className={"relative flex w-full"}>
        <div
          style={{ maxWidth: "200px" }}
          className={`${chatState.chatMessage ? "hidden" : "absolute"} pointer-events-none left-4 top-2 z-10 truncate px-0.5 text-gray-500`}
        >
          {`${userState.focusUsername}님에게 메시지 보내기`}
        </div>
        <div
          ref={chatInputRef}
          contentEditable
          suppressContentEditableWarning={true}
          onKeyDown={(e) => handleKeyDown(e)}
          onInput={handleChatInput}
          className={
            "custom-scrollbar relative max-h-56 w-full overflow-hidden overflow-y-scroll rounded bg-customDark_5 py-2 pl-4 pr-4 outline-none"
          }
        ></div>

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
