import { ServerInfo, UserInfo } from "../../index";
import { create } from "zustand";

interface ServerStore {
  serverState: ServerState;
  setServerState: (state: Partial<ServerState>) => void;
  serverListState: ServerInfo[];
  setServerListState: (state: ServerInfo[]) => void;
  serverUserListState: UserInfo[];
  setServerUserListState: (state: UserInfo[]) => void;
  resetServerState: () => void;
}

interface ServerState {
  id: number | undefined;
  name: string | undefined;

  inviteModalOpen: boolean;
  inviteLink: string | undefined;
  inviteLinkCopy: boolean;
  inviteUsername: string | undefined;

  settingModalOpen: boolean;
  settingDefault: boolean;
  newServerName: string | undefined;
  settingRole: boolean;
  settingUser: boolean;

  settingServerDeleteModal: boolean;
  checkServerName: string | undefined;
  serverNameVerified: boolean;

  fetchServerInfo: boolean;
  userCount: number | undefined;

  serverUserList: boolean;
  serverSearchbar: boolean;
  serverSearchOption: boolean;
  serverSearchOptionUser: boolean;
  serverSearchOptionMessage: boolean;
  searchKeyword: string | undefined;
  serverSearchList: boolean;
}

const initialServerState: ServerState = {
  id: undefined,
  name: undefined,

  inviteModalOpen: false,
  inviteLink: undefined,
  inviteLinkCopy: false,

  settingModalOpen: false,
  settingDefault: false,
  newServerName: undefined,
  settingRole: false,
  settingUser: false,

  settingServerDeleteModal: false,
  checkServerName: undefined,
  serverNameVerified: true,

  fetchServerInfo: false,
  inviteUsername: undefined,
  userCount: undefined,

  serverUserList: false,
  serverSearchbar: false,
  serverSearchOption: false,
  serverSearchOptionUser: false,
  serverSearchOptionMessage: false,
  searchKeyword: undefined,
  serverSearchList: false,
};

export const useServerStore = create<ServerStore>((set) => ({
  serverState: initialServerState,
  setServerState: (state) =>
    set((prev) => ({ serverState: { ...prev.serverState, ...state } })),
  serverListState: [],
  setServerListState: (state) => set({ serverListState: state }),
  serverUserListState: [],
  setServerUserListState: (state) => set({ serverUserListState: state }),
  resetServerState: () => set({ serverState: initialServerState }),
}));
