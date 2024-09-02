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

  focusInput: boolean;
  chatMessage: string | undefined;

  chatContextMenuOpen: boolean;
  chatEdit: boolean;
  chatDeleteModalOpen: boolean;

  enter: boolean;
}

const initialChatState: ChatState = {
  id: undefined,
  username: undefined,
  message: undefined,

  focusInput: false,
  chatMessage: undefined,

  chatContextMenuOpen: false,
  chatEdit: false,
  chatDeleteModalOpen: false,

  enter: false,
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
