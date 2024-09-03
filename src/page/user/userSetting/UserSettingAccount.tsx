import { useUserStore } from "../../../store/UserStore.tsx";
import { useState } from "react";

export default function UserSettingAccount() {
  const { userState, setUserState } = useUserStore();

  const [showEmail, setShowEmail] = useState(false);
  const hideEmail = "*".repeat(userState.email?.indexOf("@") ?? 0);
  const hideEmailDomain = userState.email?.slice(userState.email?.indexOf("@"));

  return (
    <div className={"z-10 h-full w-full px-8 py-8 text-customText"}>
      <div className={"mb-4 text-lg font-bold"}>내 계정</div>
      <div
        className={
          "mb-8 flex w-4/5 flex-col items-center rounded bg-customDark_0 px-4 py-4"
        }
      >
        <div className={"mb-6 flex w-full items-center"}>
          <div className={"px-4"}>{userState.username}</div>
          <button
            onClick={() => {
              setUserState({
                userSettingProfile: true,
                userSettingAccount: false,
              });
            }}
            className={
              "ml-auto rounded bg-indigo-500 px-4 py-1.5 hover:bg-indigo-600"
            }
          >
            사용자 프로필 편집
          </button>
        </div>

        <div
          className={
            "flex w-full flex-col gap-4 rounded bg-customDark_1 px-4 py-2"
          }
        >
          <div className={"flex items-center"}>
            <div className={"flex flex-col"}>
              <div className={"text-sm font-semibold text-gray-400"}>
                사용자명
              </div>
              <div>{userState.username}</div>
            </div>
            <button
              onClick={() => {
                setUserState({
                  userSettingProfile: true,
                  userSettingAccount: false,
                });
              }}
              className={
                "ml-auto h-9 rounded bg-customGray_0 px-4 text-sm hover:bg-customGray_2"
              }
            >
              수정
            </button>
          </div>

          <div className={"flex items-center"}>
            <div className={"flex flex-col"}>
              <div className={"text-sm font-semibold text-gray-400"}>
                이메일
              </div>

              {showEmail ? (
                <div className={"flex items-center"}>
                  <div>{userState.email}</div>
                  <button
                    onClick={() => setShowEmail(false)}
                    className={"ml-1 text-blue-400"}
                  >
                    숨기기
                  </button>
                </div>
              ) : (
                <div className={"flex items-center"}>
                  <div>
                    {hideEmail}
                    {hideEmailDomain}
                  </div>
                  <button
                    onClick={() => setShowEmail(true)}
                    className={"ml-1 text-blue-400"}
                  >
                    보이기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={"flex flex-col"}>
        <div className={"mb-2 text-sm font-semibold text-gray-400"}>
          계정 제거
        </div>
        <div className={"mb-4 text-gray-300"}>
          계정 삭제시 복구가 불가능합니다.
        </div>
        <button
          onClick={() => {
            setUserState({ userSettingDeleteUserModal: true });
          }}
          className={
            "w-32 rounded border border-red-500 py-1.5 text-white duration-100 hover:bg-red-500 hover:transition-all"
          }
        >
          계정 삭제하기
        </button>
      </div>
    </div>
  );
}
