import { create } from "zustand";
import { Chat } from "../../index";

interface ChatStore {
  chatState: ChatState;
  setChatState: (state: Partial<ChatState>) => void;
  chatListState: Chat[];
  setChatListState: (state: Chat[]) => void;
  resetChatState: () => void;
  resetChatListState: () => void;
}

interface ChatState {
  message: string | undefined;
  chatMessage: string | undefined;
}

const initialChatState: ChatState = {
  message: undefined,
  chatMessage: undefined,
};

export const useChatStore = create<ChatStore>((set) => ({
  chatState: initialChatState,
  setChatState: (state) =>
    set((prev) => ({ chatState: { ...prev.chatState, ...state } })),
  chatListState: [],
  setChatListState: (state) => set({ chatListState: state }),
  resetChatState: () => set({ chatState: initialChatState }),
  resetChatListState: () => set({ chatListState: [] }),
}));
