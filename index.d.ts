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
  name: string | undefined;
  displayOrder: number | undefined;
  lastReadMessageId: number | undefined;
  lastMessageId: number | undefined;
  serverId: number | undefined;
  categoryId: number | undefined;
  userDirectMessageId: number | undefined;
  username: string | undefined;
  avatarImageSmall: string | undefined;
}

export interface ChatInfoList {
  channelId: number;
  chatList: Chat[];
}

export interface Chat {
  id: number;
  userId: number;
  username: string;
  avatarImageSmall?: string;
  message?: string;
  attachmentType?: string;
  attachment?: string;
  attachmentFileName?: string;
  attachmentWidth?: number;
  attachmentHeight?: number;
  error?: boolean;
  enter?: boolean;
  leave?: boolean;
  createTime?: number;
  updateTime?: number;
}

export interface UserInfo {
  id: number;
  username: string;
  avatarImageSmall: string | undefined;
  online?: boolean;
}

export interface NotificationInfoList {
  notificationDirectMessageInfoDtoList: NotificationInfo[];
  notificationServerInfoDtoList: NotificationInfo[];
}

export interface NotificationInfo {
  serverId?: number;
  serverName?: string;
  channelId: number;
  channelName: string | null;
  chatId: number;
  chatMessage: string | null;
  chatAttachment: string | null;
  chatCreateTime: number | null;
  chatUpdateTime: number | null;
  userId: number;
  username: string;
  avatarImageSmall: string | null;
}

export interface StompChatMessage {
  messageType: string;
  serverId: number;
  categoryId: number;
  channelId: number;
  chatId: number;
  userId: number;
  username: string;
  avatar: string;
  online: boolean;
  message: string;
  createTime?: number;
  updateTime?: number;

  attachment?: string;
  attachmentWidth?: number;
  attachmentHeight?: number;
}

export interface ImageInfo {
  link: string | undefined;
  width: number | undefined;
  height: number | undefined;
}
