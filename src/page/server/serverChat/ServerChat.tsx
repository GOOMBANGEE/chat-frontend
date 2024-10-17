import ServerChatHeader from "./ServerChatHeader.tsx";
import ChatComponent from "./chat/ChatComponent.tsx";
import ChatInput from "./chat/ChatInput.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import ServerChatDropdown from "./serverChatDropdown/ServerChatDropdown.tsx";
import UserInfoMenu from "../UserInfoMenu.tsx";
import ChatContextMenu from "./chat/ChatContextMenu.tsx";
import ChatDeleteModal from "./chat/ChatDeleteModal.tsx";
import { useServerStore } from "../../../store/ServerStore.tsx";
import ServerChatUserList from "./serverUser/ServerChatUserList.tsx";
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
import useReadMessage from "../../../hook/server/serverChat/useReadMessage.tsx";
import ServerChatNewMessageBar from "./ServerChatNewMessageBar.tsx";
import useFetchChatListBefore from "../../../hook/server/serverChat/useFetchChatListBefore.tsx";
import { Chat } from "../../../../index";
import NewLine from "./NewLine.tsx";
import { throttle } from "lodash";
import ServerUserInfoMenu from "./serverUser/ServerUserInfoMenu.tsx";
import ServerIndexDMList from "../serverIndex/ServerIndexDMList.tsx";

export default function ServerChat() {
  const { readMessage } = useReadMessage();
  const { fetchChatListBefore } = useFetchChatListBefore();

  const { serverState, resetServerState } = useServerStore();
  const { categoryState, resetCategoryState } = useCategoryStore();
  const { channelState, setChannelState, channelListState, resetChannelState } =
    useChannelStore();
  const { chatState, setChatState, chatListState } = useChatStore();
  const { userState } = useUserStore();

  // 스크롤 이벤트
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  // 이전 채팅기록 가져오기전에 현재 스크롤 위치 기억
  const [scrollHeightBeforeFetch, setScrollHeightBeforeFetch] = useState(0);
  const [scrollTopBeforeFetch, setScrollTopBeforeFetch] = useState(0);
  // 가져온 chatListState 에서 가장 작은 chatId
  const [leastFetchChatId, setLeastFetchChatId] = useState(0);
  //
  const [lastReadMessageId, setLastReadMessageId] = useState<
    number | null | undefined
  >();

  // 채팅리스트 fetch 후 채널에 맞는 채팅으로 정렬되었는지 확인 후 업데이트
  const [chatList, setChatList] = useState<Chat[]>();
  const [update, setUpdate] = useState(false);

  const serverChatRef = useRef<HTMLDivElement>(null);
  // newLine chat 구분하여 component 위치 확인
  const chatRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // 채널 변경여부 확인
  const channelIdRef = useRef<number | undefined>(channelState.id);
  const leastFetchChatIdRef = useRef(leastFetchChatId);

  // scroll 이벤트에서 channelState.initialRender 동기화를 위한 장치
  const channelStateRef = useRef(channelState);
  useEffect(() => {
    channelStateRef.current = channelState;
  }, [channelState]);

  // 채널변경시, 새로고침시 작동
  // 해당 채널에 맞는 chatList 생성 -> 생성완료되면 아래 이벤트들 트리거로 사용
  useEffect(() => {
    setUpdate(false);
    if (
      channelState.id !== channelIdRef.current ||
      channelState.userDirectMessageId !== undefined
    ) {
      // 채널변경시 이전 채널아이디와 다른경우 initialRender true -> 자동으로 읽음처리 되지않도록 트리거설정
      setChannelState({ initialRender: true });

      const lastReadMessageId = channelListState.find(
        (channelInfo) => channelInfo.id === channelState.id,
      )?.lastReadMessageId;
      setLastReadMessageId(lastReadMessageId);

      const filteredChatInfoList = chatListState.filter(
        (chatInfoList) => chatInfoList.channelId === channelState.id,
      );
      const filteredChatList = filteredChatInfoList.flatMap(
        (chatInfoList) => chatInfoList.chatList,
      );
      setLeastFetchChatId(filteredChatList[0]?.id);
      leastFetchChatIdRef.current = leastFetchChatId;
      setChatList(filteredChatList);
      setUpdate(true);
    }

    return () => {
      setChatList(undefined);
      channelIdRef.current = undefined;
    };
  }, [channelState.id, chatListState]);

  // 채팅 가져왔을때, 스크롤 이벤트
  useEffect(() => {
    if (serverChatRef.current) {
      setScrollHeightBeforeFetch(serverChatRef.current.scrollHeight);
      setScrollTopBeforeFetch(serverChatRef.current.scrollTop);
    }

    // 첫 렌더링시 최하단 스크롤 위치
    if (
      update &&
      leastFetchChatId &&
      channelState.initialRender &&
      serverChatRef.current &&
      !channelState.newMessageId &&
      !channelState.fetchChatListBefore
    ) {
      serverChatRef.current.scrollTop = serverChatRef.current.scrollHeight;
    }

    // fetchChatListBefore 호출 후, ServerChatNewMessageBar 에서 fetchChatListBefore 호출 후
    // 새로 추가된 높이만큼 스크롤 보정
    if (update && serverChatRef.current && channelState.fetchChatListBefore) {
      const newScrollHeight = serverChatRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - scrollHeightBeforeFetch;
      serverChatRef.current.scrollTo({
        top: scrollTopBeforeFetch + scrollDiff,
        behavior: "smooth",
      });
      setChannelState({ fetchChatListBefore: false });
    }

    const handleScroll = throttle(() => {
      if (serverChatRef.current) {
        // 스크롤 최하단 이동시 모든 메시지를 읽은것으로 간주
        const isBottom =
          serverChatRef.current.scrollTop +
            serverChatRef.current.clientHeight >=
          serverChatRef.current.scrollHeight - 1;
        const currentChannelState = channelStateRef.current;
        if (
          isBottom &&
          currentChannelState.lastMessageId !==
            currentChannelState.lastReadMessageId &&
          currentChannelState.newMessage &&
          !currentChannelState.initialRender
        ) {
          setChannelState({ scrollBottom: true });
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }

          // 바닥에 도달했을 때 1초 유지되면
          const timeout = setTimeout(() => {
            if (channelState.lastMessageId) {
              readMessage({ chatId: channelState.lastMessageId });
            }
          }, 1000);

          setScrollTimeout(timeout);
        } else {
          setChannelState({ scrollBottom: false, initialRender: false });
          // 바닥에서 벗어나면 타이머 초기화
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            setScrollTimeout(null);
          }
        }

        // 메시지 추가로 fetch
        const isTop = serverChatRef.current.scrollTop === 0;
        if (isTop) {
          // 현재 스크롤 높이와 위치를 저장
          setScrollHeightBeforeFetch(serverChatRef.current.scrollHeight);
          setScrollTopBeforeFetch(serverChatRef.current.scrollTop);

          // 채팅 불러오기
          fetchChatListBefore();
        }
      }
    }, 200);

    // 스크롤 이벤트 추가
    const chatContainer = serverChatRef.current;
    if (chatContainer && update) {
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
  }, [update, chatList]);

  // newMessageBar 의 버튼 클릭시 스크롤 이동
  useEffect(() => {
    if (update && channelState.moveNewLine) {
      let relativeTop: number = 0;
      Object.values(chatRefs.current).forEach((chatRef) => {
        if (chatRef && serverChatRef.current) {
          const chatRect = chatRef.getBoundingClientRect();
          relativeTop = serverChatRef.current.scrollTop + chatRect.top - 40;
        }
      });

      if (serverChatRef.current && relativeTop) {
        serverChatRef.current.scrollTo({
          top: relativeTop,
          behavior: "smooth",
        });
      }
    }
    setChannelState({ moveNewLine: false });
  }, [channelState.moveNewLine]);

  // 채팅시 스크롤 아래로 이동
  useEffect(() => {
    if (chatState.sendMessage && serverChatRef.current) {
      serverChatRef.current.scrollTo({
        top: serverChatRef.current.scrollHeight,
        behavior: "smooth",
      });
      setChannelState({ newMessage: false });
      setChatState({ sendMessage: false });
    }
  }, [chatState.sendMessage]);

  // 새로운 메시지를 받을때
  useEffect(() => {
    // useReadMessage 작동 후 -> channelState.newMessageScroll true
    // 윈도우 포커스 && 스크롤이 최하단인 경우 -> channelState.newMessageScroll true
    if (channelState.newMessageScroll && serverChatRef.current) {
      serverChatRef.current.scrollTo({
        top: serverChatRef.current.scrollHeight,
        behavior: "smooth",
      });
      if (channelState.newMessageId) {
        readMessage({ chatId: channelState.newMessageId });
      }

      setChannelState({
        newMessage: false,
        newMessageId: undefined,
        newMessageScroll: false,
      });
    }
  }, [channelState.newMessageScroll]);

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

  useEffect(() => {
    return () => {
      resetServerState();
      resetCategoryState();
      resetChannelState();
    };
  }, []);

  return (
    <div className={"relative flex h-full w-full"}>
      {serverState.id ? (
        <div className={"relative flex w-60 flex-col gap-0 bg-customDark_2"}>
          <ServerChatDropdown />
          <ServerChatCategoryChannelList />
          <UserInfoMenu />
        </div>
      ) : (
        <div className={"relative h-full w-72 bg-customDark_2"}>
          <ServerIndexDMList />
          <UserInfoMenu />
        </div>
      )}

      <div
        style={{ maxWidth: "calc(100vw - 320px)" }}
        className={"flex h-full w-full flex-col"}
      >
        <ServerChatHeader />
        {serverState.searchOptionMenu ? <ChatSearchOption /> : null}

        <div className={"flex h-full w-full"}>
          {/* chat component*/}
          <div
            style={{
              maxWidth: `${serverState.serverUserList || serverState.searchList ? "calc(100vw - 580px)" : "calc(100vw - 320px)"}`,
              maxHeight: "calc(100vh - 70px)",
            }}
            className={"relative flex h-full w-full flex-col"}
          >
            {chatList &&
            channelState.newMessage &&
            !channelState.newMessageScroll &&
            lastReadMessageId ? (
              <ServerChatNewMessageBar
                leastFetchChatId={leastFetchChatId}
                lastReadMessageId={lastReadMessageId}
                chatRef={serverChatRef}
                chatList={chatList}
              />
            ) : null}

            <div
              ref={serverChatRef}
              style={{ maxHeight: "calc(100vh - 120px)" }}
              className={
                "custom-scrollbar flex h-full flex-col overflow-y-auto px-2 py-2"
              }
            >
              <div className={"flex w-full flex-col"}>
                {update &&
                  chatList?.map((chat) => {
                    const shouldAssignRef =
                      (channelState.newMessage &&
                        lastReadMessageId &&
                        chat.id === lastReadMessageId) ||
                      (channelState.newMessage &&
                        lastReadMessageId &&
                        chat.id === leastFetchChatId &&
                        leastFetchChatId > lastReadMessageId);

                    return (
                      <div key={chat.id} className={"relative h-full"}>
                        {channelState.newMessage &&
                        lastReadMessageId &&
                        chat.id === leastFetchChatId &&
                        leastFetchChatId > lastReadMessageId ? (
                          <div className={"mt-6"}>
                            <NewLine />
                          </div>
                        ) : null}

                        <ChatComponent
                          ref={
                            shouldAssignRef
                              ? (el) => (chatRefs.current[chat.id] = el)
                              : null
                          }
                          data-id={chat.id}
                          chat={chat}
                          leastFetchChatId={leastFetchChatId}
                          lastReadMessageId={lastReadMessageId}
                        />

                        {channelState.newMessage &&
                        lastReadMessageId &&
                        chat.id === lastReadMessageId ? (
                          <NewLine />
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className={"mt-auto"}>
              <ChatInput />
            </div>
          </div>

          {userState.userInfoMenu ? <ServerUserInfoMenu /> : null}
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
