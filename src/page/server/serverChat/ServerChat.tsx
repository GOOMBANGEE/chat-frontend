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
import { useEffect, useRef } from "react";
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

export default function ServerChat() {
  const { chatState, chatListState } = useChatStore();
  const { serverState } = useServerStore();
  const { categoryState } = useCategoryStore();
  const { channelState } = useChannelStore();
  const { userState } = useUserStore();

  // 채팅 갱신시 스크롤 아래로 이동
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatListState]);

  return (
    <div
      style={{ maxHeight: "100vh" }}
      className={"relative flex h-full max-h-full w-full"}
    >
      <div className={"relative w-60 bg-customDark_2"}>
        <ServerChatDropdown />
        <ServerChatCategoryChannelList />
        <UserInfoMenu />
      </div>

      <div className={"flex h-full w-full flex-col"}>
        <ServerChatHeader />
        {serverState.searchOptionMenu ? <ChatSearchOption /> : null}
        <div className={"flex h-full w-full"}>
          <div className={"flex h-full w-full flex-col"}>
            <div
              ref={chatContainerRef}
              style={{ maxHeight: "calc(100vh - 120px)" }}
              className={"custom-scrollbar overflow-y-auto px-2 py-2"}
            >
              {chatListState.map((chat) => (
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
