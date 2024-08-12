import { create } from "zustand";

export interface GlobalStore {
  globalState: GlobalState;
  setGlobalState: (state: Partial<GlobalState>) => void;
  resetGlobalState: () => void;
}

interface GlobalState {
  loading: boolean;
  errorMessage: string | undefined;
  pageInvalid: boolean;
  loginExpire: boolean;
  fetchProfile: boolean;
}

const initialGlobalState: GlobalState = {
  loading: true,
  errorMessage: undefined,
  pageInvalid: false,
  loginExpire: false,
  fetchProfile: false,
};
export const useGlobalStore = create<GlobalStore>((set) => ({
  globalState: initialGlobalState,
  setGlobalState: (state) => {
    set((prev) => ({ globalState: { ...prev.globalState, ...state } }));
  },
  resetGlobalState: () => set({ globalState: initialGlobalState }),
}));
