import { useEffect } from "react";
import { useUserStore } from "../../../store/UserStore.tsx";
import useLogout from "../../../hook/user/useLogout.tsx";

export default function UserSettingLogoutModal() {
  const { logout } = useLogout();
  const { userState, setUserState } = useUserStore();

  const handleClickCancelButton = () => {
    setUserState({ userSettingLogoutModal: false });
  };

  const handleClickLogoutButton = () => {
    logout();
    window.location.href = "/";
  };

  // modal 바깥쪽 클릭시 modal close
  const handleClickOutside = (e: MouseEvent) => {
    if (
      userState.userSettingLogoutModal &&
      !(e.target as HTMLElement).closest(".user-setting-logout-modal")
    ) {
      handleClickCancelButton();
    }
  };
  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [userState, setUserState]);

  return (
    <div
      className={
        "fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 z-10 bg-gray-700 opacity-50"}></div>
      <div
        className={
          "user-setting-logout-modal z-20 flex items-center justify-center"
        }
      >
        <div
          style={{ width: "450px" }}
          className={
            "absolute mx-4 flex flex-col rounded bg-customDark_3 text-center text-customText"
          }
        >
          <div className={"px-4 py-4 text-start text-xl font-semibold"}>
            로그아웃
          </div>
          <div className={"mb-8 px-4 text-start"}>
            정말로 로그아웃하시겠어요?
          </div>
          <div
            className={
              "flex w-full items-center justify-end gap-4 rounded-b bg-customDark_1 px-4 py-4"
            }
          >
            <button
              onClick={() => handleClickCancelButton()}
              className={"px-4 py-2 text-white hover:underline"}
            >
              취소
            </button>
            <button
              onClick={() => handleClickLogoutButton()}
              className={
                "rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              }
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
