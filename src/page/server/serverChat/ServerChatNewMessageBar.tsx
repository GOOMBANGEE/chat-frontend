import useReadMessage from "../../../hook/server/serverChat/useReadMessage.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";
import { Chat } from "../../../../index";
import useFetchChatListBefore from "../../../hook/server/serverChat/useFetchChatListBefore.tsx";
import React from "react";

interface Props {
  leastFetchChatId: number;
  lastReadMessageId: number;
  chatRef: React.ForwardedRef<HTMLDivElement>;
  chatList: Chat[];
}

export default function ServerChatNewMessageBar(props: Readonly<Props>) {
  const { readMessage } = useReadMessage();
  const { fetchChatListBefore } = useFetchChatListBefore();
  const { channelState, setChannelState } = useChannelStore();

  const unreadChatCount = props.chatList.filter(
    (chat) => chat.id > (channelState.lastReadMessageId ?? 0),
  ).length;

  const handleClickFetchChatListBefore = () => {
    if (
      typeof props.chatRef !== "function" &&
      props.chatRef !== null &&
      props.chatRef.current !== null
    ) {
      // 이미 fetch 되어있는 경우 newLine 으로 스크롤 이동
      setChannelState({ initialRender: true, moveNewLine: true });
      if (props.leastFetchChatId > props.lastReadMessageId) {
        // 아직 fetch 되어있지 않은 경우 fetchChatListBefore -> 늘어난만큼 스크롤 보정
        fetchChatListBefore();
      }
    }
  };

  const handleClickRead = () => {
    if (channelState.lastMessageId) {
      readMessage({ chatId: channelState.lastMessageId });
    }
  };

  return (
    <div
      style={{ zIndex: 2 }}
      className={"absolute w-full px-2 text-customText"}
    >
      <div className={"mx-4 flex rounded-b bg-indigo-500 px-2 py-1"}>
        <button
          onClick={handleClickFetchChatListBefore}
          className={"flex-grow text-start"}
        >
          읽지 않은 메시지가 {unreadChatCount}개 있어요
        </button>
        <button
          onClick={handleClickRead}
          className={"flex items-center font-semibold"}
        >
          읽음으로 표시하기
          <svg
            className={"ml-1"}
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
                className={"stroke-white"}
                d="M9 12.2222L10.8462 14L15 10M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z"
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
