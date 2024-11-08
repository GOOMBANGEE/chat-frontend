import { ChannelInfo, UserInfo } from "../../index";
import { create } from "zustand";

interface ChannelStore {
  channelState: ChannelState;
  setChannelState: (state: Partial<ChannelState>) => void;
  channelListState: ChannelInfo[];
  setChannelListState: (state: ChannelInfo[]) => void;
  directMessageChannelListState: ChannelInfo[];
  setDirectMessageChannelListState: (state: ChannelInfo[]) => void;
  notificationChannelListState: ChannelInfo[];
  setNotificationChannelListState: (state: ChannelInfo[]) => void;
  channelUserListState: UserInfo[];
  setChannelUserListState: (state: UserInfo[]) => void;
  resetChannelState: () => void;
}

interface ChannelState {
  id: number | undefined;
  name: string | undefined;
  displayOrder: number | undefined;
  lastReadMessageId: number | undefined;
  lastMessageId: number | undefined;
  serverId: number | undefined;
  categoryId: number | undefined;
  userDirectMessageId: number | undefined;
  userDirectMessageAvatar: string | undefined;

  // channel focus -> 채팅을 수신했을때, 읽음처리할지 결정
  windowFocus: boolean;
  newMessageId: number | undefined;
  newMessage: boolean;
  newMessageScroll: boolean;
  scrollBottom: boolean;

  // 채팅을 가져온 다음 스크롤 아래로 이동
  fetchChatList: boolean;
  fetchChatListBefore: boolean;
  // 첫 렌더인지 확인 -> 새로고침, 채널변경시 스크롤 제일 아래일때 읽음처리 안되도록
  initialRender: boolean;
  // ServerChatNewMessageBar 에서 handleClickFetchChatListBefore 클릭
  // 이전 채팅 가져오기 또는 newLine 으로 이동하는 로직구현
  moveNewLine: boolean;

  // channel create modal
  createModalOpen: boolean;
  createModalName: string | undefined;
  createModalOptionOpen: boolean;

  // context menu
  contextMenu: boolean;
  deleteModalOpen: boolean;

  // channel setting
  settingModalOpen: boolean;
  settingDefault: boolean;
  settingAuth: boolean;
  newName: string | undefined;

  // dm channel notification
  isHover: boolean;
  hoverId: number | undefined;
  hoverName: string | undefined;
  hoverButtonY: number | undefined;
}

const initialChannelState: ChannelState = {
  id: undefined,
  name: undefined,
  displayOrder: undefined,
  lastReadMessageId: undefined,
  lastMessageId: undefined,
  serverId: undefined,
  categoryId: undefined,
  userDirectMessageId: undefined,
  userDirectMessageAvatar: undefined,

  // channel focus -> 채팅을 수신했을때, 읽음처리할지 결정
  windowFocus: false,
  newMessageId: undefined,
  newMessage: false,
  newMessageScroll: false,
  scrollBottom: false,

  // 채팅을 가져온 다음 스크롤 아래로 이동
  fetchChatList: false,
  fetchChatListBefore: false,
  // 첫 렌더인지 확인 -> 새로고침, 채널변경시 스크롤 제일 아래일때 읽음처리 안되도록
  initialRender: true,
  // ServerChatNewMessageBar 에서 handleClickFetchChatListBefore 클릭
  // 이전 채팅 가져오기 또는 newLine 으로 이동하는 로직구현
  moveNewLine: false,

  // channel create modal
  createModalOpen: false,
  createModalName: undefined,
  createModalOptionOpen: true,

  // context menu
  contextMenu: false,
  deleteModalOpen: false,

  // channel setting
  settingModalOpen: false,
  settingDefault: false,
  settingAuth: false,
  newName: undefined,

  // dm channel notification
  isHover: false,
  hoverId: undefined,
  hoverName: undefined,
  hoverButtonY: undefined,
};

export const useChannelStore = create<ChannelStore>((set) => ({
  channelState: initialChannelState,
  setChannelState: (state) =>
    set((prev) => ({ channelState: { ...prev.channelState, ...state } })),
  channelListState: [],
  setChannelListState: (state) => set({ channelListState: state }),
  directMessageChannelListState: [],
  setDirectMessageChannelListState: (state) =>
    set({ directMessageChannelListState: state }),
  notificationChannelListState: [],
  setNotificationChannelListState: (state) =>
    set({ notificationChannelListState: state }),
  channelUserListState: [],
  setChannelUserListState: (state) => set({ channelUserListState: state }),
  resetChannelState: () => set({ channelState: initialChannelState }),
}));
