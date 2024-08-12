import { create } from "zustand";

const BASE_URL_USER = import.meta.env.VITE_BASE_URL_USER;
const BASE_URL_WEB_SOCKET = import.meta.env.VITE_BASE_URL_WEB_SOCKET;
const BASE_URL_STOMP = import.meta.env.VITE_BASE_URL_STOMP;

interface EnvStore {
  envState: EnvState;
  setEnvState: (state: Partial<EnvState>) => void;
}

interface EnvState {
  userUrl: string;
  websocketUrl: string;
  stompUrl: string;
}

const initialEnvState: EnvState = {
  userUrl: BASE_URL_USER,
  websocketUrl: BASE_URL_WEB_SOCKET,
  stompUrl: BASE_URL_STOMP,
};

export const useEnvStore = create<EnvStore>((set) => ({
  envState: initialEnvState,
  setEnvState: (state) =>
    set((prev) => ({ envState: { ...prev.envState, ...state } })),
}));
