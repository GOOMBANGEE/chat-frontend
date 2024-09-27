import ServerChatHeader from "./ServerChatHeader.tsx";
import ChatComponent from "./chat/ChatComponent.tsx";
import ChatInput from "./chat/ChatInput.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import ServerChatDropdown from "./serverChatDropdown/ServerChatDropdown.tsx";
import UserInfoMenu from "../UserInfoMenu.tsx";
import ChatContextMenu from "./chat/ChatContextMenu.tsx";
import ChatDeleteModal from "./chat/ChatDeleteModal.tsx";
import { useServerStore } from "../../../store/ServerStore.tsx";
import ServerChatUserList from "./ServerChatUserList.tsx";
import ChatSearchOption from "./chat/ChatSearchOption.tsx";
import ServerChatSearchList from "./ServerChatSearchList.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import UserContextMenu from "../UserContextMenu.tsx";
import { useEffect, useRef, useState } from "react";
import ServerChatCategoryChannelList from "./serverChatCategoryChannel/ServerChatCategoryChannelList.tsx";
import { useCategoryStore } from "../../../store/CategoryStore.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";
import ChannelContextMenu from "./channel/ChannelContextMenu.tsx";
import ChannelDeleteModal from "./channel/ChannelDeleteModal.tsx";
import ServerChatCategoryChannelContextMenu from "./serverChatCategoryChannel/ServerChatCategoryChannelContextMenu.tsx";
import CategoryContextMenu from "./category/CategoryContextMenu.tsx";
import ChannelCreateModal from "./channel/ChannelCreateModal.tsx";
import CategoryCreateModal from "./category/CategoryCreateModal.tsx";
import CategoryDeleteModal from "./category/CategoryDeleteModal.tsx";
import { Chat } from "../../../../index";
import useReadMessage from "../../../hook/server/serverChat/useReadMessage.tsx";
import ServerChatNewMessageBar from "./ServerChatNewMessageBar.tsx";
import useFetchChatListBefore from "../../../hook/server/serverChat/useFetchChatListBefore.tsx";

export default function ServerChat() {
  const { readMessage } = useReadMessage();
  const { fetchChatListBefore } = useFetchChatListBefore();

  const { serverState } = useServerStore();
  const { categoryState } = useCategoryStore();
  const { channelState, setChannelState } = useChannelStore();
  const { chatState, setChatState, chatListState } = useChatStore();
  const { userState } = useUserStore();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [scrollHeightBeforeFetch, setScrollHeightBeforeFetch] = useState(0);
  const [scrollTopBeforeFetch, setScrollTopBeforeFetch] = useState(0);

  const filteredChatInfoList = chatListState.filter(
    (chatInfoList) =>
      chatInfoList.serverId === serverState.id &&
      chatInfoList.channelId === channelState.id,
  );
  const filteredChatList: Chat[] = filteredChatInfoList.flatMap(
    (chatInfoList) => chatInfoList.chatList,
  );

  // lastReadMessageId와 lastMessageId가 같을경우 스크롤 최하단 위치
  useEffect(() => {
    if (
      channelState.lastReadMessageId === channelState.lastMessageId &&
      chatContainerRef.current
    ) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current?.scrollHeight;
      setChannelState({ fetchChatList: false });
    } else {
      setChannelState({ newMessage: true, fetchChatList: false });
    }

    return () => {
      setChannelState({ newMessage: false, fetchChatList: false });
    };
  }, [channelState.id, channelState.fetchChatList]);

  // 채팅시 스크롤 아래로 이동
  useEffect(() => {
    if (chatState.sendMessage && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      setChatState({ sendMessage: false });
    }
  }, [chatState.sendMessage]);

  // 새로운 메시지를 받을때
  useEffect(() => {
    if (channelState.newMessage) {
      // 스크롤이 최하단인 경우
      if (channelState.newMessageScroll && chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
        if (channelState.newMessageId) {
          readMessage({ chatId: channelState.newMessageId });
        }

        setChannelState({
          newMessage: false,
          newMessageId: undefined,
          newMessageScroll: false,
        });
      }
    }
  }, [channelState.newMessage]);

  // 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;

        // 스크롤 최하단 이동시 모든 메시지를 읽은것으로 간주
        const isBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if (isBottom) {
          setChannelState({ scrollBottom: true });
          // 바닥에 도달했을 때 1초 유지되면
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }

          const timeout = setTimeout(() => {
            if (channelState.lastMessageId) {
              readMessage({ chatId: channelState.lastMessageId });
            }
          }, 1000);

          setScrollTimeout(timeout);
        } else {
          setChannelState({ scrollBottom: false });
          // 바닥에서 벗어나면 타이머 초기화
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            setScrollTimeout(null);
          }
        }

        // 메시지 추가로 fetch
        const isTop = scrollTop === 0;
        if (isTop) {
          // 현재 스크롤 높이와 위치를 저장
          setScrollHeightBeforeFetch(scrollHeight);
          setScrollTopBeforeFetch(scrollTop);

          // 채팅 불러오기
          fetchChatListBefore();
        }
      }
    };

    // 스크롤 이벤트 추가
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [chatListState, channelState.id, scrollTimeout]);

  // fetchChatListBefore 호출 후 새로 추가된 높이만큼 스크롤 보정
  useEffect(() => {
    if (chatContainerRef.current && channelState.fetchChatListBefore) {
      const newScrollHeight = chatContainerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - scrollHeightBeforeFetch;
      chatContainerRef.current.scrollTop = scrollTopBeforeFetch + scrollDiff;
      setChannelState({ fetchChatListBefore: false });
    }
  }, [channelState.fetchChatListBefore]);

  // 윈도우 포커스 감지
  useEffect(() => {
    const handleFocus = () => {
      setChannelState({ windowFocus: true });
    };

    const handleBlur = () => {
      setChannelState({ windowFocus: false });
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [setChannelState]);

  return (
    <div
      style={{ maxHeight: "100vh" }}
      className={"relative flex h-full max-h-full w-full"}
    >
      <div className={"relative flex w-60 flex-col gap-0 bg-customDark_2"}>
        <ServerChatDropdown />
        <ServerChatCategoryChannelList />
        <UserInfoMenu />
      </div>

      <div className={"flex h-full w-full flex-col"}>
        <ServerChatHeader />
        {serverState.searchOptionMenu ? <ChatSearchOption /> : null}
        <div className={"flex h-full w-full"}>
          <div className={"relative flex h-full w-full flex-col"}>
            {channelState.newMessage && !channelState.newMessageScroll ? (
              <ServerChatNewMessageBar />
            ) : null}
            <div
              ref={chatContainerRef}
              style={{ maxHeight: "calc(100vh - 120px)" }}
              className={"custom-scrollbar overflow-y-auto px-2 py-2"}
            >
              {filteredChatList.map((chat) => (
                <ChatComponent key={chat.id} chat={chat} />
              ))}
            </div>
            <div className={"mb-3 mt-auto"}>
              <ChatInput />
            </div>
          </div>

          {serverState.serverUserList ? <ServerChatUserList /> : null}
          {serverState.searchList ? <ServerChatSearchList /> : null}
        </div>
      </div>

      {serverState.categoryChannelContextMenu ? (
        <ServerChatCategoryChannelContextMenu />
      ) : null}

      {categoryState.contextMenu ? <CategoryContextMenu /> : null}
      {categoryState.createModalOpen ? <CategoryCreateModal /> : null}
      {categoryState.deleteModalOpen ? <CategoryDeleteModal /> : null}

      {channelState.contextMenu ? <ChannelContextMenu /> : null}
      {channelState.createModalOpen ? <ChannelCreateModal /> : null}
      {channelState.deleteModalOpen ? <ChannelDeleteModal /> : null}

      {chatState.chatContextMenuOpen ? <ChatContextMenu /> : null}
      {chatState.chatDeleteModalOpen ? <ChatDeleteModal /> : null}

      {userState.userContextMenu ? <UserContextMenu /> : null}
    </div>
  );
}
