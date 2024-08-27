import { create } from "zustand";

interface UserStore {
  userState: UserState;
  setUserState: (state: Partial<UserState>) => void;
  resetUserState: () => void;
}

interface UserState {
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

  userSettingOpen: boolean;
  userSettingAccount: boolean;
  userSettingProfile: boolean;
  userSettingLogoutModal: boolean;
  userSettingDeleteUserModal: boolean;

  userSettingPasswordChangeModal: boolean;
  newUsername: string | undefined;
  newPassword: string | undefined;
  newConfirmPassword: string | undefined;
}

const initialUserState = {
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

  userSettingOpen: false,
  userSettingAccount: false,
  userSettingProfile: false,
  userSettingLogoutModal: false,
  userSettingDeleteUserModal: false,

  userSettingPasswordChangeModal: false,
  newUsername: undefined,
  newPassword: undefined,
  newConfirmPassword: undefined,
};
export const useUserStore = create<UserStore>((set) => ({
  userState: initialUserState,
  setUserState: (state) =>
    set((prev) => ({ userState: { ...prev.userState, ...state } })),
  resetUserState: () => set({ userState: initialUserState }),
}));
