export interface ServerInfo {
  id: number;
  name: string;
  icon: string;
}

export interface ServerUserInfo {
  id: number;
  username: string;
}

export interface Chat {
  id: number;
  username: string;
  message: string;
  error?: boolean;
  enter?: boolean;
  leave?: boolean;
}

export interface StompChatMessage {
  messageType: string;
  serverId: number;
  chatId: number;
  userId: number;
  username: string;
  message: string;
  enter: boolean;
  leave: boolean;
}
