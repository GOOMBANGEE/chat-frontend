import { create } from "zustand";
import { NotificationInfoList, UserInfo } from "../../index";

interface UserStore {
  userState: UserState;
  setUserState: (state: Partial<UserState>) => void;
  userFriendListState: UserInfo[];
  setUserFriendListState: (state: UserInfo[]) => void;
  userFriendWaitingListState: UserInfo[];
  setUserFriendWaitingListState: (state: UserInfo[]) => void;
  userFriendSearchListState: UserInfo[];
  setUserFriendSearchListState: (state: UserInfo[]) => void;
  userNotificationListState: NotificationInfoList;
  setUserNotificationListState: (state: Partial<NotificationInfoList>) => void;
  resetUserState: () => void;
}

interface UserState {
  id: number | undefined;
  email: string | undefined;
  username: string | undefined;
  avatar: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  emailVerified: boolean;
  usernameVerified: boolean;
  passwordVerified: boolean;
  emailErrorMessage: string | undefined;
  usernameErrorMessage: string | undefined;
  passwordErrorMessage: string | undefined;
  loginErrorMessage: string | undefined;
  login: boolean;

  userRecoverEmailSendModal: boolean;
  userRecoverTokenCheck: boolean;
  userRecoverTokenVerified: boolean;

  userSettingOpen: boolean;
  userSettingAccount: boolean;
  userSettingProfile: boolean;
  userSettingLogoutModal: boolean;
  userSettingDeleteUserModal: boolean;

  userSettingPasswordChangeModal: boolean;
  newUsername: string | undefined;
  newPassword: string | undefined;
  newConfirmPassword: string | undefined;
  // user avatar file upload
  userSettingAvatarChangeModal: boolean;
  newAvatarImage: string | undefined;

  // serverUser info
  userInfoMenu: boolean;
  userContextMenu: boolean;
  focusUserId: number | undefined;
  focusUsername: string | undefined;
  focusUserAvatar: string | undefined;
  menuPositionX: number | undefined;
  menuPositionY: number | undefined;

  // index page friend list
  indexPageFriendList: boolean;
  indexPageFriendRequestList: boolean;
  indexPageFriendAdd: boolean;
  searchUsername: string | undefined;

  // friend waiting list
  isHoverAcceptButton: boolean;
  isHoverRejectButton: boolean;
  hoverButtonY: number | undefined;
}

const initialUserState = {
  id: undefined,
  email: undefined,
  username: undefined,
  password: undefined,
  avatar: undefined,
  confirmPassword: undefined,
  emailVerified: true,
  usernameVerified: true,
  passwordVerified: true,
  emailErrorMessage: undefined,
  usernameErrorMessage: undefined,
  passwordErrorMessage: undefined,
  loginErrorMessage: undefined,
  login: false,

  userRecoverEmailSendModal: false,
  userRecoverTokenCheck: false,
  userRecoverTokenVerified: false,

  userSettingOpen: false,
  userSettingAccount: false,
  userSettingProfile: false,
  userSettingLogoutModal: false,
  userSettingDeleteUserModal: false,

  userSettingPasswordChangeModal: false,
  newUsername: undefined,
  newPassword: undefined,
  newConfirmPassword: undefined,
  // user avatar file upload
  userSettingAvatarChangeModal: false,
  newAvatarImage: undefined,

  // serverUser info
  userInfoMenu: false,
  userContextMenu: false,
  focusUserId: undefined,
  focusUsername: undefined,
  focusUserAvatar: undefined,
  menuPositionX: undefined,
  menuPositionY: undefined,

  indexPageFriendList: true,
  indexPageFriendRequestList: false,
  indexPageFriendAdd: false,
  searchUsername: undefined,

  // friend waiting list
  isHoverAcceptButton: false,
  isHoverRejectButton: false,
  hoverButtonY: undefined,
};

const initialUserNotificationListState = {
  notificationDirectMessageInfoDtoList: [],
  notificationServerInfoDtoList: [],
};

export const useUserStore = create<UserStore>((set) => ({
  userState: initialUserState,
  setUserState: (state) =>
    set((prev) => ({ userState: { ...prev.userState, ...state } })),
  userFriendListState: [],
  setUserFriendListState: (state) => set({ userFriendListState: state }),
  userFriendWaitingListState: [],
  setUserFriendWaitingListState: (state) =>
    set({ userFriendWaitingListState: state }),
  userFriendSearchListState: [],
  setUserFriendSearchListState: (state) =>
    set({ userFriendSearchListState: state }),
  userNotificationListState: initialUserNotificationListState,
  setUserNotificationListState: (state) =>
    set((prev) => ({
      userNotificationListState: {
        ...prev.userNotificationListState,
        ...state,
      },
    })),
  resetUserState: () => set({ userState: initialUserState }),
}));
