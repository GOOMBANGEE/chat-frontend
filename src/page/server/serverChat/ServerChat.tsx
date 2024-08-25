import ServerChatHeader from "./ServerChatHeader.tsx";
import ChatComponent from "./ChatComponent.tsx";
import ChatInput from "./ChatInput.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import ServerChatDropdown from "./serverChatDropdown/ServerChatDropdown.tsx";

export default function ServerChat() {
  const { chatListState } = useChatStore();

  return (
    <div className={"flex h-full w-full"}>
      <div className={"w-72 bg-serverChatSidebar"}>
        <ServerChatDropdown />
        {/*<ServerChatChannelList/>*/}
      </div>

      <div className={"flex h-full w-full flex-col"}>
        <ServerChatHeader />

        <div style={{ height: "calc(100% - 110px)" }} className={"px-6 py-2"}>
          {chatListState.map((chat) => (
            <ChatComponent key={chat.id} chat={chat} />
          ))}
        </div>
        <ChatInput />
      </div>
    </div>
  );
}
