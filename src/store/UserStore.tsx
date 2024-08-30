import { create } from "zustand";
import { UserInfo } from "../../index";

interface UserStore {
  userState: UserState;
  setUserState: (state: Partial<UserState>) => void;
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

  serverChatUserListContextMenu: boolean;
  focusUserId: number | undefined;
  focusUsername: string | undefined;
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

  serverChatUserListContextMenu: false,
  focusUserId: undefined,
  focusUsername: undefined,
};
export const useUserStore = create<UserStore>((set) => ({
  userState: initialUserState,
  setUserState: (state) =>
    set((prev) => ({ userState: { ...prev.userState, ...state } })),
  resetUserState: () => set({ userState: initialUserState }),
}));
