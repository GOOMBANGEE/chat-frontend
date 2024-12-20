import { useGlobalStore } from "../../../store/GlobalStore.tsx";
import ErrorPage from "../../ErrorPage.tsx";
import { useEffect } from "react";
import useRegisterTokenCheck from "../../../hook/user/register/useRegisterTokenCheck.tsx";
import { useRegisterConfirm } from "../../../hook/user/register/useRegisterConfirm.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import { useNavigate } from "react-router-dom";

export default function RegisterConfirm() {
  const { registerTokenCheck } = useRegisterTokenCheck();
  const { registerConfirm } = useRegisterConfirm();
  const { userState } = useUserStore();
  const { globalState } = useGlobalStore();

  const navigate = useNavigate();
  const loginUrl = "/";
  const serverUrl = "/server";

  const handleConfirmButton = async () => {
    if (await registerConfirm()) {
      navigate(loginUrl, { replace: true });
    }
  };

  useEffect(() => {
    void registerTokenCheck();
  }, []);

  // 로그인 상태라면 server로 리다이렉트
  useEffect(() => {
    if (userState.login) {
      navigate(serverUrl);
    }
  }, [userState.login]);

  return (
    <>
      {!globalState.loading ? (
        <>
          {userState.email ? (
            <div className={"flex h-full items-center justify-center"}>
              <div
                style={{ width: "480px" }}
                className={
                  "rounded bg-customDark_5 p-4 text-center text-lg font-semibold text-customText"
                }
              >
                <div className={"mb-6 mt-4"}>가입 인증</div>
                <div className={"mb-4 text-base font-semibold"}>
                  <div>{userState.email}</div>
                  <div>위 메일로 가입을 진행하려면 아래 버튼을 눌러주세요.</div>
                </div>

                <button
                  onClick={() => handleConfirmButton()}
                  className={
                    "mb-2 mt-2 w-fit rounded bg-indigo-500 px-4 py-2 text-base hover:bg-indigo-600"
                  }
                >
                  인증
                </button>
              </div>
            </div>
          ) : (
            <ErrorPage />
          )}
        </>
      ) : null}
    </>
  );
}
