import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../store/GlobalStore.tsx";
import { useUserStore } from "../store/UserStore.tsx";

export default function ErrorPage() {
  const { userState } = useUserStore();
  const { globalState, resetGlobalState } = useGlobalStore();
  const navigate = useNavigate();

  const handleHomePage = () => {
    window.location.href = "/";
  };

  const handlePrevious = () => {
    resetGlobalState();
    navigate(-1);
  };

  const renderPage = () => {
    if (globalState.pageInvalid) {
      return (
        <div className={"mt-14 px-4 text-white opacity-90"}>
          <div className={"px-2"}>
            <div className={"mb-2 font-semibold"}>ERROR 400</div>
            <div className={"mb-4 text-4xl font-semibold"}>오류</div>
            <div>올바르지않은 주소입니다</div>
            <button
              className={
                "mt-12 text-lg text-orange-600 underline underline-offset-8"
              }
              onClick={() => {
                handleHomePage();
              }}
            >
              HOME PAGE
            </button>
          </div>
        </div>
      );
    }

    if (userState.username && !globalState.loginExpire) {
      return (
        <div className={"mt-14 px-4 text-white opacity-90"}>
          <div className={"px-2"}>
            <div className={"mb-2 font-semibold"}>ERROR 400</div>
            <div className={"mb-4 text-4xl font-semibold"}>오류</div>

            <div>{globalState.errorMessage}</div>
            <button
              className={
                "mt-12 text-lg text-orange-600 underline underline-offset-8"
              }
              onClick={() => {
                handlePrevious();
              }}
            >
              PREVIOUS PAGE
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={"mt-14 px-4 text-white opacity-90"}>
        <div className={"px-2"}>
          <div className={"mb-2 font-semibold"}>ERROR 400</div>
          <div className={"mb-4 text-4xl font-semibold"}>오류</div>

          <div>로그인이 필요합니다</div>
          <button
            className={
              "mt-12 text-lg text-orange-600 underline underline-offset-8"
            }
            onClick={() => {
              handleHomePage();
            }}
          >
            HOME PAGE
          </button>
        </div>
      </div>
    );
  };

  return renderPage();
}
