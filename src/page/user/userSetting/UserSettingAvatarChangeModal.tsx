import { useEffect } from "react";
import { useUserStore } from "../../../store/UserStore.tsx";
import useChangeAvatar from "../../../hook/user/userSetting/useChangeAvatar.tsx";

export default function UserSettingAvatarChangeModal() {
  const { changeAvatar } = useChangeAvatar();
  const { userState, setUserState } = useUserStore();
  const handleClickCancelButton = () => {
    setUserState({
      userSettingAvatarChangeModal: false,
      newAvatarImage: undefined,
    });
  };

  useEffect(() => {
    return () => {
      setUserState({
        userSettingAvatarChangeModal: false,
        newAvatarImage: undefined,
      });
    };
  }, []);

  // modal 바깥쪽 클릭시 modal close
  const handleClickOutside = (e: MouseEvent) => {
    if (
      userState.userSettingAvatarChangeModal &&
      !(e.target as HTMLElement).closest(".user-setting-avatar-change-modal")
    ) {
      handleClickCancelButton();
    }
  };

  const handleClickChangeButton = () => {
    if (userState.newAvatarImage) {
      changeAvatar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userState, setUserState]);

  return (
    <div
      className={
        "fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-gray-700 opacity-50"}></div>
      <div
        className={
          "user-setting-avatar-change-modal z-20 flex items-center justify-center"
        }
      >
        <div
          style={{ width: "450px" }}
          className={
            "absolute mx-4 flex flex-col rounded bg-customDark_3 text-center text-customText"
          }
        >
          <button
            onClick={() =>
              setUserState({
                userSettingAvatarChangeModal: false,
                newAvatarImage: undefined,
              })
            }
            className={"absolute right-4 top-4 z-10 ml-auto"}
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
          <div
            className={
              "relative flex items-center justify-center px-4 pb-2 pt-4 text-xl font-semibold"
            }
          >
            아바타 변경하기
          </div>

          <div
            className={
              "flex w-full flex-col items-center justify-center px-12 py-4"
            }
          >
            <img src={userState.newAvatarImage} alt={"Avatar Image"} />
          </div>

          <div
            className={
              "flex w-full items-center justify-end gap-4 rounded-b bg-customDark_1 px-4 py-4"
            }
          >
            <button
              onClick={() => handleClickCancelButton()}
              className={"px-4 py-2 hover:underline"}
            >
              취소
            </button>
            <button
              onClick={handleClickChangeButton}
              className={"rounded bg-indigo-500 px-4 py-2 hover:bg-indigo-600"}
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
