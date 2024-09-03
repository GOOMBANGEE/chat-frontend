import { create } from "zustand";
import { UserInfo } from "../../index";

interface UserStore {
  userState: UserState;
  setUserState: (state: Partial<UserState>) => void;
  userFriendListState: UserInfo[];
  setUserFriendListState: (state: UserInfo[]) => void;
  userFriendWaitingListState: UserInfo[];
  setUserFriendWaitingListState: (state: UserInfo[]) => void;
  userFriendSearchListState: UserInfo[];
  setUserFriendSearchListState: (state: UserInfo[]) => void;
  resetUserState: () => void;
}

interface UserState {
  id: number | undefined;
  email: string | undefined;
  username: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  emailVerified: boolean;
  usernameVerified: boolean;
  passwordVerified: boolean;
  emailErrorMessage: string | undefined;
  usernameErrorMessage: string | undefined;
  passwordErrorMessage: string | undefined;
  loginErrorMessage: string | undefined;
  login: boolean;

  userRecoverEmailSendModal: boolean;
  userRecoverTokenCheck: boolean;
  userRecoverTokenVerified: boolean;

  userSettingOpen: boolean;
  userSettingAccount: boolean;
  userSettingProfile: boolean;
  userSettingLogoutModal: boolean;
  userSettingDeleteUserModal: boolean;

  userSettingPasswordChangeModal: boolean;
  newUsername: string | undefined;
  newPassword: string | undefined;
  newConfirmPassword: string | undefined;

  userContextMenu: boolean;
  focusUserId: number | undefined;
  focusUsername: string | undefined;

  // index page friend list
  indexPageFriendList: boolean;
  indexPageFriendRequestList: boolean;
  indexPageFriendAdd: boolean;
  searchUsername: string | undefined;

  // friend waiting list
  isHoverAcceptButton: boolean;
  isHoverRejectButton: boolean;
  hoverButtonY: number | undefined;
}

const initialUserState = {
  id: undefined,
  email: undefined,
  username: undefined,
  password: undefined,
  confirmPassword: undefined,
  emailVerified: true,
  usernameVerified: true,
  passwordVerified: true,
  emailErrorMessage: undefined,
  usernameErrorMessage: undefined,
  passwordErrorMessage: undefined,
  loginErrorMessage: undefined,
  login: false,

  userRecoverEmailSendModal: false,
  userRecoverTokenCheck: false,
  userRecoverTokenVerified: false,

  userSettingOpen: false,
  userSettingAccount: false,
  userSettingProfile: false,
  userSettingLogoutModal: false,
  userSettingDeleteUserModal: false,

  userSettingPasswordChangeModal: false,
  newUsername: undefined,
  newPassword: undefined,
  newConfirmPassword: undefined,

  userContextMenu: false,
  focusUserId: undefined,
  focusUsername: undefined,

  indexPageFriendList: true,
  indexPageFriendRequestList: false,
  indexPageFriendAdd: false,
  searchUsername: undefined,

  // friend waiting list
  isHoverAcceptButton: false,
  isHoverRejectButton: false,
  hoverButtonY: undefined,
};

export const useUserStore = create<UserStore>((set) => ({
  userState: initialUserState,
  setUserState: (state) =>
    set((prev) => ({ userState: { ...prev.userState, ...state } })),
  userFriendListState: [],
  setUserFriendListState: (state) => set({ userFriendListState: state }),
  userFriendWaitingListState: [],
  setUserFriendWaitingListState: (state) =>
    set({ userFriendWaitingListState: state }),
  userFriendSearchListState: [],
  setUserFriendSearchListState: (state) =>
    set({ userFriendSearchListState: state }),
  resetUserState: () => set({ userState: initialUserState }),
}));
