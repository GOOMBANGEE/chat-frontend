import { create } from "zustand";

interface ServerAddStore {
  serverAddState: ServerAddState;
  setServerAddState: (state: Partial<ServerAddState>) => void;
  resetServerAddState: () => void;
}

interface ServerAddState {
  name: string | undefined;
  code: string | undefined;
  open: boolean;
  join: boolean;
  codeVerified: boolean;
  codeErrorMessage: string | undefined;
}

const initialServerAddState: ServerAddState = {
  name: undefined,
  code: undefined,
  open: false,
  join: false,
  codeVerified: true,
  codeErrorMessage: undefined,
};

export const useServerAddStore = create<ServerAddStore>((set) => ({
  serverAddState: initialServerAddState,
  setServerAddState: (state) =>
    set((prev) => ({
      serverAddState: { ...prev.serverAddState, ...state },
    })),
  resetServerAddState: () => set({ serverAddState: initialServerAddState }),
}));
