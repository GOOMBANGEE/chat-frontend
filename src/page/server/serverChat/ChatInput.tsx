import useSendChatMessage from "../../../hook/chat/useSendChatMessage.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import { useChatStore } from "../../../store/ChatStore.tsx";
import { useServerStore } from "../../../store/ServerStore.tsx";
import { useRef } from "react";
import { Chat } from "../../../../index";

export default function ChatInput() {
  const { sendChatMessage } = useSendChatMessage();

  const { chatState, setChatState, chatListState, setChatListState } =
    useChatStore();
  const { serverState } = useServerStore();
  const { userState } = useUserStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (userState.username && chatState.message) {
        const chat: Chat = {
          id: Date.now(),
          username: userState.username,
          message: chatState.message,
        };
        const newChatList = [...chatListState, chat];
        setChatListState(newChatList);

        sendChatMessage({ chat: chat, chatList: newChatList });
      }

      setChatState({ chatMessage: undefined });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className={"flex px-6"}>
      <input
        ref={inputRef}
        onChange={(e) => setChatState({ message: e.target.value })}
        onKeyDown={(e) => handleKeyEnter(e)}
        placeholder={`${serverState.name}에 메시지 보내기`}
        className={"w-full rounded bg-customGray px-4 py-2"}
      />
    </div>
  );
}
