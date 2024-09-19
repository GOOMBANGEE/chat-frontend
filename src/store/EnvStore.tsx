import { create } from "zustand";

const BASE_URL = import.meta.env.VITE_BASE_URL_HTTP;
const BASE_URL_USER = import.meta.env.VITE_BASE_URL_USER;
const BASE_URL_SERVER = import.meta.env.VITE_BASE_URL_SERVER;
const BASE_URL_CATEGORY = import.meta.env.VITE_BASE_URL_CATEGORY;
const BASE_URL_CHANNEL = import.meta.env.VITE_BASE_URL_CHANNEL;
const BASE_URL_CHAT = import.meta.env.VITE_BASE_URL_CHAT;
const BASE_URL_WEB_SOCKET = import.meta.env.VITE_BASE_URL_WEB_SOCKET;
const BASE_URL_STOMP = import.meta.env.VITE_BASE_URL_STOMP;

interface EnvStore {
  envState: EnvState;
  setEnvState: (state: Partial<EnvState>) => void;
}

interface EnvState {
  baseUrl: string;
  userUrl: string;
  serverUrl: string;
  categoryUrl: string;
  channelUrl: string;
  chatUrl: string;
  websocketUrl: string;
  stompUrl: string;
}

const initialEnvState: EnvState = {
  baseUrl: BASE_URL,
  userUrl: BASE_URL_USER,
  serverUrl: BASE_URL_SERVER,
  categoryUrl: BASE_URL_CATEGORY,
  channelUrl: BASE_URL_CHANNEL,
  chatUrl: BASE_URL_CHAT,
  websocketUrl: BASE_URL_WEB_SOCKET,
  stompUrl: BASE_URL_STOMP,
};

export const useEnvStore = create<EnvStore>((set) => ({
  envState: initialEnvState,
  setEnvState: (state) =>
    set((prev) => ({ envState: { ...prev.envState, ...state } })),
}));
