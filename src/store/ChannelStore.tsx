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
}

const initialChannelState: ChannelState = {
  id: undefined,
  name: undefined,
  displayOrder: undefined,
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
