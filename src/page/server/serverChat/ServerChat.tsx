import ServerChatHeader from "./ServerChatHeader.tsx";
import ChatComponent from "./ChatComponent.tsx";
import ChatInput from "./ChatInput.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import ServerChatDropdown from "./serverChatDropdown/ServerChatDropdown.tsx";
import ServerChatUserInfo from "./ServerChatUserInfo.tsx";
import ChatContextMenu from "./ChatContextMenu.tsx";
import ChatDeleteModal from "./ChatDeleteModal.tsx";
import { useServerStore } from "../../../store/ServerStore.tsx";
import ServerChatUserList from "./ServerChatUserList.tsx";
import ChatSearchOption from "./ChatSearchOption.tsx";
import ServerChatSearchList from "./ServerChatSearchList.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import UserContextMenu from "../UserContextMenu.tsx";

export default function ServerChat() {
  const { chatState, chatListState } = useChatStore();
  const { serverState } = useServerStore();
  const { userState } = useUserStore();

  return (
    <div className={"flex h-full w-full"}>
      <div className={"relative w-72 bg-serverChatSidebar"}>
        <ServerChatDropdown />
        {/*<ServerChatChannelList/>*/}
        <ServerChatUserInfo />
      </div>

      <div className={"flex h-full w-full flex-col"}>
        <ServerChatHeader />
        {serverState.serverSearchOption ? <ChatSearchOption /> : null}
        <div className={"flex h-full w-full"}>
          <div className={"flex h-full w-full flex-col"}>
            <div className={"custom-scrollbar overflow-y-auto px-6 py-2"}>
              {chatListState.map((chat) => (
                <ChatComponent key={chat.id} chat={chat} />
              ))}
            </div>
            <div className={"mb-3 mt-auto"}>
              <ChatInput />
            </div>
          </div>

          {serverState.serverUserList ? <ServerChatUserList /> : null}
          {serverState.serverSearchList ? <ServerChatSearchList /> : null}
        </div>
      </div>
      {chatState.chatContextMenuOpen ? <ChatContextMenu /> : null}
      {chatState.chatDeleteModalOpen ? <ChatDeleteModal /> : null}
      {userState.userContextMenu ? <UserContextMenu /> : null}
    </div>
  );
}
