import { useCallback, useEffect } from "react";
import { useUserStore } from "../../../store/UserStore.tsx";
import useResetPassword from "../../../hook/user/useResetPassword.tsx";
import { debounce } from "lodash";
import usePasswordCheck from "../../../hook/user/register/usePasswordCheck.tsx";

export default function UserSettingPasswordChangeModal() {
  const { resetPassword } = useResetPassword();
  const { passwordCheck } = usePasswordCheck();
  const { userState, setUserState } = useUserStore();

  const debouncedPasswordCheck = useCallback(
    debounce((password: string) => {
      passwordCheck(password);
    }, 1000),
    [],
  );

  const handleClickCancelButton = () => {
    setUserState({ userSettingPasswordChangeModal: false });
  };

  const handleClickPasswordChangeButton = async () => {
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*\d).{8,20}$/.test(
        userState.newPassword ? userState.newPassword : "",
      );
    if (!passwordRegExp) {
      setUserState({
        passwordVerified: false,
        passwordErrorMessage:
          "비밀번호는 특수문자를 포함하여 8~20자로 설정해주세요.",
      });
      return;
    }

    if (userState.newPassword !== userState.newConfirmPassword) {
      setUserState({
        passwordVerified: false,
        passwordErrorMessage: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    await resetPassword();
    setUserState({ userSettingPasswordChangeModal: false });
  };

  useEffect(() => {
    return () => {
      setUserState({
        password: undefined,
        newPassword: undefined,
        newConfirmPassword: undefined,
        passwordVerified: true,
        passwordErrorMessage: undefined,
      });
    };
  }, []);

  // modal 바깥쪽 클릭시 modal close
  const handleClickOutside = (e: MouseEvent) => {
    if (
      userState.userSettingPasswordChangeModal &&
      !(e.target as HTMLElement).closest(".user-setting-password-change-modal")
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
      <div className={"fixed inset-0 bg-gray-700 opacity-50"}></div>
      <div
        className={
          "user-setting-password-change-modal z-20 flex items-center justify-center"
        }
      >
        <div
          style={{ width: "450px" }}
          className={
            "absolute mx-4 flex flex-col rounded bg-defaultBackground text-center"
          }
        >
          <button
            onClick={() =>
              setUserState({
                newPassword: undefined,
                passwordVerified: true,
                passwordErrorMessage: undefined,
                userSettingPasswordChangeModal: false,
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
                  d="M6 6L18 18M18 6L6 18"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </button>
          <div
            className={
              "relative flex items-center justify-center px-4 pb-2 pt-4 text-xl font-semibold text-white"
            }
          >
            비밀번호를 바꿔주세요
          </div>
          <div className={"text-gray-300"}>
            현재 비밀번호와 새 비밀번호를 입력하세요.
          </div>

          <div
            className={
              "mt-6 flex w-full flex-col items-center justify-center px-6"
            }
          >
            <div className={"mb-6 w-full"}>
              {userState.passwordVerified ? (
                <div
                  className={
                    "mb-2 text-start text-xs font-semibold text-gray-400"
                  }
                >
                  현재 비밀번호
                </div>
              ) : (
                <div
                  className={
                    "mb-2 text-start text-xs font-semibold text-red-400"
                  }
                >
                  현재 비밀번호{" "}
                  <span className={"font-light"}>
                    - {userState.passwordErrorMessage}
                  </span>
                </div>
              )}
              <div className={"flex"}>
                <input
                  type={"password"}
                  onChange={(e) => {
                    setUserState({
                      password: e.target.value,
                      passwordVerified: true,
                      passwordErrorMessage: undefined,
                    });
                  }}
                  className={
                    "bg-inputBackground w-full rounded px-2 py-2 text-sm"
                  }
                />
              </div>
            </div>

            <div className={"mb-6 w-full"}>
              {userState.passwordVerified ? (
                <div
                  className={
                    "mb-2 text-start text-xs font-semibold text-gray-400"
                  }
                >
                  새 비밀번호
                </div>
              ) : (
                <div
                  className={
                    "mb-2 text-start text-xs font-semibold text-red-400"
                  }
                >
                  새 비밀번호{" "}
                  <span className={"font-light"}>
                    - {userState.passwordErrorMessage}
                  </span>
                </div>
              )}
              <div className={"flex"}>
                <input
                  type={"password"}
                  onChange={(e) => {
                    setUserState({
                      newPassword: e.target.value,
                      passwordVerified: true,
                      passwordErrorMessage: undefined,
                    });
                    debouncedPasswordCheck(e.target.value);
                  }}
                  className={
                    "bg-inputBackground w-full rounded px-2 py-2 text-sm"
                  }
                />
              </div>
            </div>

            <div className={"mb-6 w-full"}>
              {userState.passwordVerified ? (
                <div
                  className={
                    "mb-2 text-start text-xs font-semibold text-gray-400"
                  }
                >
                  비밀번호 확인
                </div>
              ) : (
                <div
                  className={
                    "mb-2 text-start text-xs font-semibold text-red-400"
                  }
                >
                  비밀번호 확인{" "}
                  <span className={"font-light"}>
                    - {userState.passwordErrorMessage}
                  </span>
                </div>
              )}
              <div className={"flex"}>
                <input
                  type={"password"}
                  onChange={(e) => {
                    setUserState({
                      newConfirmPassword: e.target.value,
                      passwordVerified: true,
                      passwordErrorMessage: undefined,
                    });
                    debouncedPasswordCheck(e.target.value);
                  }}
                  className={
                    "bg-inputBackground w-full rounded px-2 py-2 text-sm"
                  }
                />
              </div>
            </div>
          </div>

          <div
            style={{ backgroundColor: "#1D2125" }}
            className={
              "flex w-full items-center justify-end gap-4 rounded-b px-4 py-4"
            }
          >
            <button
              onClick={() => handleClickCancelButton()}
              className={"px-4 py-2 text-white hover:underline"}
            >
              취소
            </button>
            <button
              onClick={() => handleClickPasswordChangeButton()}
              className={
                "rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
              }
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
