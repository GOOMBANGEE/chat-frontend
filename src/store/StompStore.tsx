import { create } from "zustand";
import { StompChatMessage } from "../../index";
import { Client } from "@stomp/stompjs";

interface StompStore {
  stompState: StompState;
  setStompState: (state: Partial<StompState>) => void;
  resetStompState: () => void;
}

interface StompState {
  client: Client | undefined;
  message: string | undefined;
  chatMessage: StompChatMessage | undefined;
  subscriptionUrl: Set<string>;
}

const initialStompState: StompState = {
  client: undefined,
  message: undefined,
  chatMessage: undefined,
  subscriptionUrl: new Set<string>(),
};

export const useStompStore = create<StompStore>((set) => ({
  stompState: initialStompState,
  setStompState: (state) =>
    set((prev) => ({ stompState: { ...prev.stompState, ...state } })),
  resetStompState: () => set({ stompState: initialStompState }),
}));
