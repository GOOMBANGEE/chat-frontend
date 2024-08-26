import { create } from "zustand";
import { StompChatMessage } from "../../index";

interface StompStore {
  stompState: StompState;
  setStompState: (state: Partial<StompState>) => void;
  resetStompState: () => void;
}

interface StompState {
  message: string | undefined;
  chatMessage: StompChatMessage | undefined;
}

const initialStompState: StompState = {
  message: undefined,
  chatMessage: undefined,
};

export const useStompStore = create<StompStore>((set) => ({
  stompState: initialStompState,
  setStompState: (state) =>
    set((prev) => ({ stompState: { ...prev.stompState, ...state } })),
  resetStompState: () => set({ stompState: initialStompState }),
}));
