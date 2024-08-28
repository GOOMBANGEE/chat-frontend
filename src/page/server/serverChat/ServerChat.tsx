import ServerChatHeader from "./ServerChatHeader.tsx";
import ChatComponent from "./ChatComponent.tsx";
import ChatInput from "./ChatInput.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import ServerChatDropdown from "./serverChatDropdown/ServerChatDropdown.tsx";
import ServerChatUserInfo from "./ServerChatUserInfo.tsx";
import ChatContextMenu from "./ChatContextMenu.tsx";
import ChatDeleteModal from "./ChatDeleteModal.tsx";

export default function ServerChat() {
  const { chatState, chatListState } = useChatStore();

  return (
    <div className={"flex h-full w-full"}>
      <div className={"relative w-72 bg-serverChatSidebar"}>
        <ServerChatDropdown />
        {/*<ServerChatChannelList/>*/}
        <ServerChatUserInfo />
      </div>

      <div className={"flex h-full w-full flex-col"}>
        <ServerChatHeader />

        <div
          style={{ height: "calc(100% - 110px)" }}
          className={"custom-scrollbar overflow-y-auto px-6 py-2"}
        >
          {chatListState.map((chat) => (
            <ChatComponent key={chat.id} chat={chat} />
          ))}
        </div>
        <ChatInput />

        {chatState.chatContextMenuOpen ? <ChatContextMenu /> : null}
        {chatState.chatDeleteModalOpen ? <ChatDeleteModal /> : null}
      </div>
    </div>
  );
}
