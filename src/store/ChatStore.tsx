import { create } from "zustand";
import { Chat } from "../../index";

interface ChatStore {
  chatState: ChatState;
  setChatState: (state: Partial<ChatState>) => void;
  chatListState: Chat[];
  setChatListState: (state: Chat[]) => void;
  chatSearchListState: Chat[];
  setChatSearchListState: (state: Chat[]) => void;
  resetChatState: () => void;
  resetChatListState: () => void;
}

interface ChatState {
  id: number | undefined;
  username: string | undefined;
  message: string | undefined;
  chatMessage: string | undefined;

  chatContextMenuOpen: boolean;
  chatEdit: boolean;
  chatDeleteModalOpen: boolean;
}

const initialChatState: ChatState = {
  id: undefined,
  username: undefined,
  message: undefined,
  chatMessage: undefined,

  chatContextMenuOpen: false,
  chatEdit: false,
  chatDeleteModalOpen: false,
};

export const useChatStore = create<ChatStore>((set) => ({
  chatState: initialChatState,
  setChatState: (state) =>
    set((prev) => ({ chatState: { ...prev.chatState, ...state } })),
  chatListState: [],
  setChatListState: (state) => set({ chatListState: state }),
  chatSearchListState: [],
  setChatSearchListState: (state) => set({ chatSearchListState: state }),
  resetChatState: () => set({ chatState: initialChatState }),
  resetChatListState: () => set({ chatListState: [] }),
}));
