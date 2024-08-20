import { Server } from "../../index";
import { create } from "zustand";

interface ServerStore {
  serverState: ServerState;
  setServerState: (state: Partial<ServerState>) => void;
  serverListState: Server[];
  setServerListState: (state: Server[]) => void;
  resetServerState: () => void;
}

interface ServerState {
  id: number | undefined;
  name: string | undefined;
}

const initialServerState: ServerState = {
  id: undefined,
  name: undefined,
};

export const useServerStore = create<ServerStore>((set) => ({
  serverState: initialServerState,
  setServerState: (state) =>
    set((prev) => ({ serverState: { ...prev.serverState, ...state } })),
  serverListState: [],
  setServerListState: (state) => set({ serverListState: state }),
  resetServerState: () => set({ serverState: initialServerState }),
}));
