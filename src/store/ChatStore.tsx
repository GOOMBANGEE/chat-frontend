import { create } from "zustand";
import { Chat, ChatInfoList } from "../../index";

interface ChatStore {
  chatState: ChatState;
  setChatState: (state: Partial<ChatState>) => void;
  chatListState: ChatInfoList[];
  setChatListState: (state: ChatInfoList[]) => void;
  chatSearchListState: Chat[];
  setChatSearchListState: (state: Chat[]) => void;
  resetChatState: () => void;
  resetChatListState: () => void;
}

interface ChatState {
  id: number | undefined;
  username: string | undefined;
  message: string | undefined;
  createTime: number | undefined;
  updateTime: number | undefined;

  focusInput: boolean;
  chatMessage: string | undefined;
  // send message 후 scroll 최하단위치
  sendMessage: boolean;

  chatContextMenuOpen: boolean;
  chatEdit: boolean;
  chatDeleteModalOpen: boolean;

  enter: boolean;
}

const initialChatState: ChatState = {
  id: undefined,
  username: undefined,
  message: undefined,
  createTime: undefined,
  updateTime: undefined,

  focusInput: false,
  chatMessage: undefined,
  // send message 후 scroll 최하단위치
  sendMessage: false,

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
