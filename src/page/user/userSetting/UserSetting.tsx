import { useUserStore } from "../../../store/UserStore.tsx";
import UserSettingSidebar from "./UserSettingSidebar.tsx";
import UserSettingProfile from "./UserSettingProfile.tsx";
import UserSettingAccount from "./UserSettingAccount.tsx";
import UserSettingLogoutModal from "./UserSettingLogoutModal.tsx";
import UserSettingDeleteUserModal from "./UserSettingDeleteUserModal.tsx";
import UserSettingPasswordChangeModal from "./UserSettingPasswordChangeModal.tsx";
import UserSettingAvatarChangeModal from "./UserSettingAvatarChangeModal.tsx";

export default function UserSetting() {
  const { userState, setUserState } = useUserStore();

  return (
    <div
      style={{ zIndex: 3 }}
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-customDark_3"}></div>

      <div className={"z-10 flex h-full w-full"}>
        <UserSettingSidebar />
        {userState.userSettingAccount ? <UserSettingAccount /> : null}
        {userState.userSettingProfile ? <UserSettingProfile /> : null}
        {userState.userSettingAvatarChangeModal ? (
          <UserSettingAvatarChangeModal />
        ) : null}
        {userState.userSettingPasswordChangeModal ? (
          <UserSettingPasswordChangeModal />
        ) : null}
        {userState.userSettingLogoutModal ? <UserSettingLogoutModal /> : null}
        {userState.userSettingDeleteUserModal ? (
          <UserSettingDeleteUserModal />
        ) : null}

        <button
          className={"absolute right-20 top-10 z-10 ml-auto"}
          onClick={() => {
            setUserState({
              userSettingOpen: false,
              userSettingAccount: false,
              userSettingProfile: false,
            });
          }}
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                className={"stroke-customGray_4"}
                d="M6 6L18 18M18 6L6 18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}
