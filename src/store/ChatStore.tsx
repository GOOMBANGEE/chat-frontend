import { create } from "zustand";
import { ChatInfoList, ChatSearchInfo } from "../../index";

interface ChatStore {
  chatState: ChatState;
  setChatState: (state: Partial<ChatState>) => void;
  chatListState: ChatInfoList[];
  setChatListState: (state: ChatInfoList[]) => void;
  chatSearchListState: ChatSearchInfo;
  setChatSearchListState: (state: ChatSearchInfo) => void;
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
  attachmentType: string | undefined;
  attachment: string | undefined;
  attachmentFileName: string | undefined;
  attachmentWidth: number | undefined;
  attachmentHeight: number | undefined;
  // send message 후 scroll 최하단위치
  sendMessage: boolean;

  focusDmInput: boolean;

  chatContextMenuOpen: boolean;
  chatEdit: boolean;
  focusUserId: number | undefined;
  focusUsername: string | undefined;
  focusUserAvatarImageSmall: string | undefined;
  focusAttachment: string | undefined;
  focusAttachmentWidth: number | undefined;
  focusAttachmentHeight: number | undefined;
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
  attachmentType: undefined,
  attachment: undefined,
  attachmentFileName: undefined,
  attachmentWidth: undefined,
  attachmentHeight: undefined,
  // send message 후 scroll 최하단위치
  sendMessage: false,

  focusDmInput: false,

  chatContextMenuOpen: false,
  chatEdit: false,
  focusUserId: undefined,
  focusUsername: undefined,
  focusUserAvatarImageSmall: undefined,
  focusAttachment: undefined,
  focusAttachmentWidth: undefined,
  focusAttachmentHeight: undefined,
  chatDeleteModalOpen: false,

  enter: false,
};

const initialChatSearchListState: ChatSearchInfo = {
  chatList: [],
};

export const useChatStore = create<ChatStore>((set) => ({
  chatState: initialChatState,
  setChatState: (state) =>
    set((prev) => ({ chatState: { ...prev.chatState, ...state } })),
  chatListState: [],
  setChatListState: (state) => set({ chatListState: state }),
  chatSearchListState: initialChatSearchListState,
  setChatSearchListState: (state) =>
    set((prev) => ({
      chatSearchListState: { ...prev.chatSearchListState, ...state },
    })),
  resetChatState: () => set({ chatState: initialChatState }),
  resetChatListState: () => set({ chatListState: [] }),
}));
