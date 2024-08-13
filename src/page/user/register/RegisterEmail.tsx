import { useUserStore } from "../../../store/UserStore.tsx";
import useRegisterEmailSend from "../../../hook/user/register/useRegisterEmailSend.tsx";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../../ErrorPage.tsx";

export default function RegisterEmail() {
  const { registerEmailSend } = useRegisterEmailSend();
  const { userState, resetUserState } = useUserStore();

  const navigate = useNavigate();
  const loginUrl = "/";

  const handleEmailSendButton = () => {
    registerEmailSend();
  };

  const handleNavigateButton = (url: string) => {
    navigate(url);
    resetUserState();
  };

  return (
    <>
      {userState.email ? (
        <div className={"flex h-full items-center justify-center"}>
          <div
            style={{ width: "480px" }}
            className={
              "rounded bg-menuGray p-4 text-center text-lg font-semibold text-white"
            }
          >
            <div className={"mb-6 mt-4"}>인증 필요</div>
            <div className={"mb-4 text-base font-semibold"}>
              <div>{userState.email}</div>
              <div>위 주소로 메일이 발송되었습니다.</div>
              <div>메일에 있는 링크를 통해 인증해주세요.</div>
            </div>
            <div
              className={"mx-auto flex flex-col items-center justify-center"}
            >
              <button
                className={
                  "w-fit cursor-pointer px-4 text-sm font-medium text-customPurple hover:underline"
                }
                onClick={() => handleEmailSendButton()}
              >
                메일이 도착하지 않았나요?
              </button>
              <button
                onClick={() => handleNavigateButton(loginUrl)}
                className={
                  "mb-2 mt-2 w-fit rounded bg-indigo-400 px-2 py-2 text-base"
                }
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ErrorPage />
      )}
    </>
  );
}
