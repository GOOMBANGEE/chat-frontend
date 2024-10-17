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
  icon: string | undefined;

  // server invite modal
  inviteModalOpen: boolean;
  inviteLink: string | undefined;
  inviteLinkCopy: boolean;
  inviteUsername: string | undefined;

  // ServerListHover
  isHover: boolean;
  hoverServerId: number | undefined;
  hoverServerName: string | undefined;
  hoverButtonY: number | undefined;
  isHoverDmButton: boolean;
  isHoverAddButton: boolean;

  // server setting
  settingModalOpen: boolean;
  settingDefault: boolean;
  newServerIcon: string | undefined;
  newServerName: string | undefined;
  settingRole: boolean;
  settingUser: boolean;

  // server delete
  settingServerDeleteModal: boolean;
  checkServerName: string | undefined;
  serverNameVerified: boolean;

  // server join
  fetchServerInfo: boolean;
  userCount: number | undefined;

  // server user list
  serverUserList: boolean;

  // search
  searchList: boolean;
  searchbar: boolean;
  searchOptionMenu: boolean;
  searchOption: boolean;
  searchOptionUser: boolean;
  searchOptionMessage: boolean;
  searchDefault: string | undefined;
  searchUser: string | undefined;
  searchMessage: string | undefined;

  // server category channel context menu
  categoryChannelContextMenu: boolean;
}

const initialServerState: ServerState = {
  id: undefined,
  name: undefined,
  icon: undefined,

  inviteModalOpen: false,
  inviteLink: undefined,
  inviteLinkCopy: false,

  // ServerListHover
  isHover: false,
  hoverServerId: undefined,
  hoverServerName: undefined,
  hoverButtonY: undefined,
  isHoverDmButton: false,
  isHoverAddButton: false,

  settingModalOpen: false,
  settingDefault: false,
  newServerIcon: undefined,
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

  searchList: false,
  searchbar: false,
  searchOptionMenu: false,
  searchOption: false,
  searchOptionUser: false,
  searchOptionMessage: false,
  searchDefault: undefined,
  searchUser: undefined,
  searchMessage: undefined,

  // server category channel context menu
  categoryChannelContextMenu: false,
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
