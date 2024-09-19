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
