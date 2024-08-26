import { ServerInfo } from "../../index";
import { create } from "zustand";

interface ServerStore {
  serverState: ServerState;
  setServerState: (state: Partial<ServerState>) => void;
  serverListState: ServerInfo[];
  setServerListState: (state: ServerInfo[]) => void;
  resetServerState: () => void;
}

interface ServerState {
  id: number | undefined;
  name: string | undefined;

  inviteModalOpen: boolean;
  inviteLink: string | undefined;
  inviteLinkCopy: boolean;
  inviteUsername: string | undefined;

  fetchServerInfo: boolean;
  userCount: number | undefined;
}

const initialServerState: ServerState = {
  id: undefined,
  name: undefined,

  inviteModalOpen: false,
  inviteLink: undefined,
  inviteLinkCopy: false,

  fetchServerInfo: false,
  inviteUsername: undefined,
  userCount: undefined,
};

export const useServerStore = create<ServerStore>((set) => ({
  serverState: initialServerState,
  setServerState: (state) =>
    set((prev) => ({ serverState: { ...prev.serverState, ...state } })),
  serverListState: [],
  setServerListState: (state) => set({ serverListState: state }),
  resetServerState: () => set({ serverState: initialServerState }),
}));
