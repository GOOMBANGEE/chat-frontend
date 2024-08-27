import { useUserStore } from "../../../store/UserStore.tsx";

export default function UserSettingSidebar() {
  const { userState, setUserState } = useUserStore();

  return (
    <div
      className={"flex h-full w-96 flex-col bg-serverListSidebar text-gray-400"}
    >
      <div
        className={"ml-auto flex w-40 flex-col gap-0.5 py-10 pr-2 text-start"}
      >
        <div className={"px-2 text-xs font-semibold text-gray-500"}>
          사용자 설정
        </div>
        <div className={"my-1 border border-customDarkGray"}></div>
        <button
          onClick={() => {
            setUserState({
              userSettingAccount: true,
              userSettingProfile: false,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDarkGray hover:text-gray-300 ${userState.userSettingAccount ? "bg-customGray text-white" : ""}`}
        >
          내 계정
        </button>
        <button
          onClick={() => {
            setUserState({
              userSettingProfile: true,
              userSettingAccount: false,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDarkGray hover:text-gray-300 ${userState.userSettingProfile ? "bg-customGray text-white" : ""}`}
        >
          프로필
        </button>
        <div className={"my-1 border border-customDarkGray"}></div>
        <button
          onClick={() => {
            setUserState({ userSettingLogoutModal: true });
          }}
          className={
            "rounded px-2 py-1 text-start hover:bg-customDarkGray hover:text-gray-300"
          }
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
