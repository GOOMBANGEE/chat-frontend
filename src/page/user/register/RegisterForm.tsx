import { FormEvent, useCallback } from "react";
import { useUserStore } from "../../../store/UserStore.tsx";
import { useNavigate } from "react-router-dom";
import useRegister from "../../../hook/user/register/useRegister.tsx";
import { useGlobalStore } from "../../../store/GlobalStore.tsx";
import useEmailCheck from "../../../hook/user/register/useEmailCheck.tsx";
import useUsernameCheck from "../../../hook/user/register/useUsernameCheck.tsx";
import usePasswordCheck from "../../../hook/user/register/usePasswordCheck.tsx";
import { debounce } from "lodash";

export default function RegisterForm() {
  const { emailCheck } = useEmailCheck();
  const { usernameCheck } = useUsernameCheck();
  const { passwordCheck } = usePasswordCheck();
  const { register } = useRegister();
  const { userState, setUserState, resetUserState } = useUserStore();
  const { resetGlobalState } = useGlobalStore();

  const navigate = useNavigate();
  const loginUrl = "/";
  const registerEmailUrl = "/register/email";

  const debouncedEmailCheck = useCallback(
    debounce((email: string) => {
      emailCheck(email);
    }, 1000),
    [],
  );

  const debouncedUsernameCheck = useCallback(
    debounce((username: string) => {
      usernameCheck(username);
    }, 1000),
    [],
  );

  const debouncedPasswordCheck = useCallback(
    debounce((password: string) => {
      passwordCheck(password);
    }, 1000),
    [],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const emailRegExp =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/.test(
        userState.email ? userState.email : "",
      );
    if (!emailRegExp) {
      setUserState({
        emailVerified: false,
        emailErrorMessage: "- 유효하지 않은 이메일입니다.",
      });
      return;
    }

    const usernameRegExp = /^[A-Za-z0-9가-힣]{2,20}$/.test(
      userState.username ? userState.username : "",
    );
    if (!usernameRegExp) {
      setUserState({
        usernameVerified: false,
        usernameErrorMessage: "- 사용자명은 2~20자로 설정해주세요.",
      });
      return;
    }

    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*\d).{8,20}$/.test(
        userState.password ? userState.password : "",
      );
    if (!passwordRegExp) {
      setUserState({
        passwordVerified: false,
        passwordErrorMessage:
          "- 비밀번호는 특수문자를 포함하여 8~20자로 설정해주세요.",
      });
      return;
    }

    if (userState.password !== userState.confirmPassword) {
      setUserState({
        passwordVerified: false,
        passwordErrorMessage: "- 비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    if (await register()) {
      navigate(registerEmailUrl);
    }
  };

  const handleNavigateButton = (url: string) => {
    navigate(url);
    resetUserState();
    resetGlobalState();
  };

  return (
    <div className={"flex h-full items-center justify-center"}>
      <div
        style={{ width: "480px" }}
        className={
          "rounded bg-menuGray p-4 text-center text-lg font-semibold text-white"
        }
      >
        <div className={"mb-6 mt-2"}>계정 만들기</div>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className={"mx-auto mb-2 flex w-full flex-col gap-y-2 px-4"}
        >
          {userState.emailVerified ? (
            <div className={"text-start text-xs text-gray-300"}>이메일</div>
          ) : (
            <div className={"text-start text-xs text-red-400"}>
              이메일{" "}
              <span className={"font-light"}>
                {userState.emailErrorMessage}
              </span>
            </div>
          )}
          <input
            onChange={(e) => {
              setUserState({
                email: e.target.value,
                emailVerified: true,
                emailErrorMessage: undefined,
              });
              debouncedEmailCheck(e.target.value);
            }}
            className={
              "mb-2 w-full rounded bg-customDarkGray px-2 py-1 text-base font-medium hover:ring-1 hover:ring-customPurple focus:outline-none focus:ring-2 focus:ring-customPurple"
            }
          />

          {userState.usernameVerified ? (
            <div className={"text-start text-xs text-gray-300"}>사용자명</div>
          ) : (
            <div className={"text-start text-xs text-red-400"}>
              사용자명{" "}
              <span className={"font-light"}>
                {userState.usernameErrorMessage}
              </span>
            </div>
          )}
          <input
            onChange={(e) => {
              setUserState({
                username: e.target.value,
                usernameVerified: true,
                usernameErrorMessage: undefined,
              });
              debouncedUsernameCheck(e.target.value);
            }}
            className={
              "mb-2 w-full rounded bg-customDarkGray px-2 py-1 text-base font-medium hover:ring-1 hover:ring-customPurple focus:outline-none focus:ring-2 focus:ring-customPurple"
            }
          />

          {userState.passwordVerified ? (
            <div className={"text-start text-xs text-gray-300"}>비밀번호</div>
          ) : (
            <div className={"text-start text-xs text-red-400"}>
              비밀번호{" "}
              <span className={"font-light"}>
                {userState.passwordErrorMessage}
              </span>
            </div>
          )}
          <input
            type={"password"}
            onChange={(e) => {
              setUserState({
                password: e.target.value,
                passwordVerified: true,
                passwordErrorMessage: undefined,
              });
              debouncedPasswordCheck(e.target.value);
            }}
            className={
              "mb-2 w-full rounded bg-customDarkGray px-2 py-1 text-base font-medium hover:ring-1 hover:ring-customPurple focus:outline-none focus:ring-2 focus:ring-customPurple"
            }
          />

          {userState.passwordVerified ? (
            <div className={"text-start text-xs text-gray-300"}>
              비밀번호확인
            </div>
          ) : (
            <div className={"text-start text-xs text-red-400"}>
              비밀번호확인{" "}
              <span className={"font-light"}>
                {userState.passwordErrorMessage}
              </span>
            </div>
          )}
          <input
            type={"password"}
            onChange={(e) => {
              setUserState({
                confirmPassword: e.target.value,
                passwordVerified: true,
                passwordErrorMessage: undefined,
              });
            }}
            className={
              "mb-2 w-full rounded bg-customDarkGray px-2 py-1 text-base font-medium hover:ring-1 hover:ring-customPurple focus:outline-none focus:ring-2 focus:ring-customPurple"
            }
          />
          <button
            type="submit"
            className={"mb-2 mt-2 w-full rounded bg-indigo-400 py-2 text-base"}
          >
            등록
          </button>
        </form>
        <button
          className={
            "flex w-fit cursor-pointer px-4 text-sm font-medium text-customPurple hover:underline"
          }
          onClick={() => handleNavigateButton(loginUrl)}
        >
          이미 계정이 있으신가요?
        </button>
      </div>
    </div>
  );
}
