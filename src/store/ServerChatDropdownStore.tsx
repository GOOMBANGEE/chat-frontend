import { create } from "zustand";

interface ServerChatDropdownStore {
  serverChatDropdownState: ServerChatDropdownState;
  setServerChatDropdownState: (state: Partial<ServerChatDropdownState>) => void;
  resetServerDropdownState: () => void;
}

interface ServerChatDropdownState {
  open: boolean;
}

const initialServerChatDropdownState: ServerChatDropdownState = {
  open: false,
};

export const useServerChatDropdownStore = create<ServerChatDropdownStore>(
  (set) => ({
    serverChatDropdownState: initialServerChatDropdownState,
    setServerChatDropdownState: (state) =>
      set((prev) => ({
        serverChatDropdownState: { ...prev.serverChatDropdownState, ...state },
      })),
    resetServerDropdownState: () =>
      set({ serverChatDropdownState: initialServerChatDropdownState }),
  }),
);
