import { create } from "zustand";
import axios from "axios";

const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;
const TOKEN_EXPIRE_TIME = import.meta.env.VITE_TOKEN_EXPIRE_TIME;

interface TokenStore {
  tokenState: TokenState;
  setTokenState: (state: Partial<TokenState>) => void;
  setHeaderAccessToken: (accessToken: string) => void;
}

interface TokenState {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  accessTokenKey: string;
  refreshTokenKey: string;
  tokenExpireTime: number;
}

const initialTokenState: TokenState = {
  accessToken: undefined,
  refreshToken: undefined,
  accessTokenKey: ACCESS_TOKEN_KEY,
  refreshTokenKey: REFRESH_TOKEN_KEY,
  tokenExpireTime: TOKEN_EXPIRE_TIME,
};

export const useTokenStore = create<TokenStore>((set) => ({
  tokenState: initialTokenState,
  setTokenState: (state) =>
    set((prev) => ({ tokenState: { ...prev.tokenState, ...state } })),
  // 서버에서 받은 accessToken을 헤더에 저장하고 이후 요청시마다 Authorization에 accessToken 첨부
  setHeaderAccessToken: (accessToken) => {
    set((prev) => ({
      tokenState: { ...prev.tokenState, accessToken: accessToken },
    }));
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  },
}));
