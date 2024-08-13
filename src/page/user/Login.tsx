import { FormEvent, useEffect } from "react";
import { useUserStore } from "../../store/UserStore.tsx";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../store/GlobalStore.tsx";
import useLogin from "../../hook/user/useLogin.tsx";

export default function Login() {
  const { login } = useLogin();
  const { userState, setUserState, resetUserState } = useUserStore();
  const { resetGlobalState } = useGlobalStore();

  const navigate = useNavigate();
  const serverUrl = "/server";
  const recoverUrl = "/recover";
  const registerUrl = "/register";

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

    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*\d).{8,20}$/.test(
        userState.password ? userState.password : "",
      );
    if (!passwordRegExp) {
      setUserState({
        passwordVerified: false,
        passwordErrorMessage: "- 유효하지 않은 비밀번호입니다.",
      });
      return;
    }

    if (await login()) {
      navigate(serverUrl);
      return;
    }
    setUserState({
      loginErrorMessage: "- 유효하지 않은 이메일 또는 비밀번호입니다.",
    });
  };

  const handleNavigateButton = (url: string) => {
    navigate(url);
    resetUserState();
    resetGlobalState();
  };

  useEffect(() => {
    if (userState.login) {
      navigate(serverUrl);
    }
  }, [userState.login]);

  return (
    <>
      {!userState.login ? (
        <div className={"flex h-full items-center justify-center"}>
          <div
            style={{ width: "480px" }}
            className={
              "rounded bg-menuGray p-4 text-center text-lg font-semibold text-white"
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
                {userState.loginErrorMessage ? (
                  <div className={"mb-1 text-start text-xs text-red-400"}>
                    이메일{" "}
                    <span className={"font-light"}>
                      {userState.loginErrorMessage}
                    </span>
                  </div>
                ) : (
                  <>
                    {userState.emailVerified ? (
                      <div className={"mb-1 text-start text-xs text-gray-300"}>
                        이메일
                      </div>
                    ) : (
                      <div className={"mb-1 text-start text-xs text-red-400"}>
                        이메일{" "}
                        <span className={"font-light"}>
                          {userState.emailErrorMessage}
                        </span>
                      </div>
                    )}
                  </>
                )}

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
                    "mb-2 w-full rounded bg-customDarkGray px-2 py-1 text-base font-medium hover:ring-1 hover:ring-customPurple focus:outline-none focus:ring-2 focus:ring-customPurple"
                  }
                />
              </div>

              <div className={"w-full"}>
                {userState.loginErrorMessage ? (
                  <div className={"mb-1 text-start text-xs text-red-400"}>
                    비밀번호{" "}
                    <span className={"font-light"}>
                      {userState.loginErrorMessage}
                    </span>
                  </div>
                ) : (
                  <>
                    {userState.passwordVerified ? (
                      <div className={"mb-1 text-start text-xs text-gray-300"}>
                        비밀번호
                      </div>
                    ) : (
                      <div className={"mb-1 text-start text-xs text-red-400"}>
                        비밀번호{" "}
                        <span className={"font-light"}>
                          {userState.passwordErrorMessage}
                        </span>
                      </div>
                    )}
                  </>
                )}

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
                    "w-full rounded bg-customDarkGray px-2 py-1 text-base hover:ring-1 hover:ring-customPurple focus:outline-none focus:ring-2 focus:ring-customPurple"
                  }
                />

                <button
                  type={"button"}
                  className={
                    "flex w-fit cursor-pointer text-sm font-medium text-customPurple hover:underline"
                  }
                  onClick={() => {
                    handleNavigateButton(recoverUrl);
                  }}
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>
              <button
                type="submit"
                className={"mt-2 w-full rounded bg-indigo-400 py-2 text-base"}
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
                  "w-fit cursor-pointer text-sm font-medium text-customPurple hover:underline"
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
    </>
  );
}
