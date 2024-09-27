import { ChannelInfo, UserInfo } from "../../index";
import { create } from "zustand";

interface ChannelStore {
  channelState: ChannelState;
  setChannelState: (state: Partial<ChannelState>) => void;
  channelListState: ChannelInfo[];
  setChannelListState: (state: ChannelInfo[]) => void;
  channelUserListState: UserInfo[];
  setChannelUserListState: (state: UserInfo[]) => void;
  resetChannelState: () => void;
}

interface ChannelState {
  id: number | undefined;
  name: string | undefined;
  displayOrder: number | undefined;
  lastReadMessageId: number | undefined;
  lastMessageId: number | undefined;
  serverId: number | undefined;
  categoryId: number | undefined;

  // channel focus -> 채팅을 수신했을때, 읽음처리할지 결정
  windowFocus: boolean;
  newMessageId: number | undefined;
  newMessage: boolean;
  newMessageScroll: boolean;
  scrollBottom: boolean;
  // 채팅을 가져온 다음 스크롤 아래로 이동
  fetchChatList: boolean;

  // channel create modal
  createModalOpen: boolean;
  createModalName: string | undefined;
  createModalOptionOpen: boolean;

  // context menu
  contextMenu: boolean;
  deleteModalOpen: boolean;

  // channel setting
  settingModalOpen: boolean;
  settingDefault: boolean;
  settingAuth: boolean;
  newName: string | undefined;
}

const initialChannelState: ChannelState = {
  id: undefined,
  name: undefined,
  displayOrder: undefined,
  lastReadMessageId: undefined,
  lastMessageId: undefined,
  serverId: undefined,
  categoryId: undefined,

  // channel focus -> 채팅을 수신했을때, 읽음처리할지 결정
  windowFocus: false,
  newMessageId: undefined,
  newMessage: false,
  newMessageScroll: false,
  scrollBottom: false,
  // 채팅을 가져온 다음 스크롤 아래로 이동
  fetchChatList: false,

  // channel create modal
  createModalOpen: false,
  createModalName: undefined,
  createModalOptionOpen: true,

  // context menu
  contextMenu: false,
  deleteModalOpen: false,

  // channel setting
  settingModalOpen: false,
  settingDefault: false,
  settingAuth: false,
  newName: undefined,
};

export const useChannelStore = create<ChannelStore>((set) => ({
  channelState: initialChannelState,
  setChannelState: (state) =>
    set((prev) => ({ channelState: { ...prev.channelState, ...state } })),
  channelListState: [],
  setChannelListState: (state) => set({ channelListState: state }),
  channelUserListState: [],
  setChannelUserListState: (state) => set({ channelUserListState: state }),
  resetChannelState: () => set({ channelState: initialChannelState }),
}));
