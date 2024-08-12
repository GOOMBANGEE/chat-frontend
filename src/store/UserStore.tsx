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
  login: boolean;
}

const initialUserState = {
  email: undefined,
  username: undefined,
  password: undefined,
  confirmPassword: undefined,
  emailVerified: true,
  usernameVerified: true,
  passwordVerified: true,
  login: false,
};
export const useUserStore = create<UserStore>((set) => ({
  userState: initialUserState,
  setUserState: (state) =>
    set((prev) => ({ userState: { ...prev.userState, ...state } })),
  resetUserState: () => set({ userState: initialUserState }),
}));
