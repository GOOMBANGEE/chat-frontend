export interface ServerInfo {
  id: number;
  name: string;
  icon: string;
}

export interface CategoryInfo {
  id: number;
  name: string;
  displayOrder: number;
  serverId: number;
}

export interface ChannelInfo {
  id: number;
  name: string;
  displayOrder: number;
  serverId: number;
  categoryId: number;
}

export interface UserInfo {
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
  createTime?: number;
  updateTime?: number;
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
  friendRequest: boolean;
  friendAccept: boolean;
  friendDelete: boolean;
  createTime?: number;
  updateTime?: number;
}
