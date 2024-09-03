import { FormEvent, useEffect } from "react";
import { useUserStore } from "../../store/UserStore.tsx";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../store/GlobalStore.tsx";
import useLogin from "../../hook/user/useLogin.tsx";
import useRecover from "../../hook/user/useRecover.tsx";
import RecoverEmailSendModal from "./recover/RecoverEmailSendModal.tsx";

export default function Login() {
  const { login } = useLogin();
  const { recover } = useRecover();
  const { userState, setUserState, resetUserState } = useUserStore();
  const { resetGlobalState } = useGlobalStore();

  const navigate = useNavigate();
  const serverUrl = "/server";
  const registerUrl = "/register";

  // 로그인
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // 유효성 검사
    const emailRegExp =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/.test(
        userState.email ? userState.email : "",
      );
    if (!emailRegExp) {
      setUserState({
        emailVerified: false,
        emailErrorMessage: "유효하지 않은 이메일입니다.",
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
        passwordErrorMessage: "유효하지 않은 비밀번호입니다.",
      });
      return;
    }

    if (await login()) {
      navigate(serverUrl);
      return;
    }
    setUserState({
      loginErrorMessage: "유효하지 않은 이메일 또는 비밀번호입니다.",
    });
  };

  // navigate -> state reset
  const handleNavigateButton = (url: string) => {
    navigate(url);
    resetUserState();
    resetGlobalState();
  };

  // 로그인 상태라면 server로 리다이렉트
  useEffect(() => {
    if (userState.login) {
      navigate(serverUrl);
    }
  }, [userState.login]);

  const handleClickRecoverButton = async () => {
    // 유효성 검사
    const emailRegExp =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/.test(
        userState.email ? userState.email : "",
      );
    if (!emailRegExp) {
      setUserState({
        emailVerified: false,
        emailErrorMessage: "유효하지 않은 이메일입니다.",
      });
      return;
    }

    recover();
  };

  return (
    <>
      {!userState.login ? (
        <div className={"flex h-full items-center justify-center"}>
          <div
            style={{ width: "480px" }}
            className={
              "rounded bg-customDark_5 p-4 text-center text-lg font-semibold text-customText"
            }
          >
            <div className={"mb-6 mt-2"}>로그인</div>
            <form
              onSubmit={(e) => {
                void handleSubmit(e);
              }}
              className={
                "mx-auto mb-2 flex w-full flex-col items-center gap-y-2 px-4"
              }
            >
              <div className={"w-full"}>
                <div
                  className={`mb-1 text-start text-xs ${userState.emailVerified && !userState.loginErrorMessage ? "text-gray-300" : "text-red-400"}`}
                >
                  이메일
                  {userState.loginErrorMessage ? (
                    <span className={"font-light"}>
                      - {userState.loginErrorMessage}
                    </span>
                  ) : null}
                  {!userState.emailVerified ? (
                    <span className={"font-light"}>
                      - {userState.emailErrorMessage}
                    </span>
                  ) : null}
                </div>

                <input
                  onChange={(e) => {
                    setUserState({
                      email: e.target.value,
                      emailVerified: true,
                      emailErrorMessage: undefined,
                      loginErrorMessage: undefined,
                    });
                  }}
                  className={
                    "hover:ring-customPurple mb-2 w-full rounded bg-customDark_1 px-2 py-1 text-base font-medium outline-none hover:ring-1 focus:ring-2 focus:ring-indigo-400"
                  }
                />
              </div>

              <div className={"w-full"}>
                <div
                  className={`mb-1 text-start text-xs ${userState.passwordVerified && !userState.loginErrorMessage ? "text-gray-300" : "text-red-400"}`}
                >
                  비밀번호
                  {userState.loginErrorMessage ? (
                    <span className={"font-light"}>
                      - {userState.loginErrorMessage}
                    </span>
                  ) : null}
                  {!userState.passwordVerified ? (
                    <span className={"font-light"}>
                      - {userState.passwordErrorMessage}
                    </span>
                  ) : null}
                </div>
                <input
                  type={"password"}
                  onChange={(e) => {
                    setUserState({
                      password: e.target.value,
                      passwordVerified: true,
                      passwordErrorMessage: undefined,
                      loginErrorMessage: undefined,
                    });
                  }}
                  className={
                    "hover:ring-customPurple w-full rounded bg-customDark_1 px-2 py-1 text-base outline-none hover:ring-1 focus:ring-2 focus:ring-indigo-400"
                  }
                />

                <button
                  type={"button"}
                  className={
                    "mt-1 flex w-fit cursor-pointer text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                  }
                  onClick={() => {
                    handleClickRecoverButton();
                  }}
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>
              <button
                type="submit"
                className={
                  "mt-2 w-full rounded bg-indigo-500 py-2 text-base text-white hover:bg-indigo-600"
                }
              >
                로그인
              </button>
            </form>
            <div
              className={
                "text-light mb-4 px-4 text-start text-sm text-gray-400"
              }
            >
              계정이 필요한가요?{" "}
              <button
                className={
                  "w-fit cursor-pointer text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                }
                onClick={() => {
                  handleNavigateButton(registerUrl);
                }}
              >
                가입하기
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {userState.userRecoverEmailSendModal ? <RecoverEmailSendModal /> : null}
    </>
  );
}
