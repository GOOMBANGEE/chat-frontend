import useCheckPath from "../../../hook/useCheckPath.tsx";
import { useGlobalStore } from "../../../store/GlobalStore.tsx";
import { useEffect } from "react";
import ErrorPage from "../../ErrorPage.tsx";
import useRecoverTokenCheck from "../../../hook/user/useRecoverTokenCheck.tsx";
import useRecoverConfirm from "../../../hook/user/useRecoverConfirm.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import { useNavigate } from "react-router-dom";

export default function Recover() {
  const { checkPath } = useCheckPath();
  const { recoverTokenCheck } = useRecoverTokenCheck();
  const { recoverConfirm } = useRecoverConfirm();
  const { userState, setUserState } = useUserStore();
  const { globalState } = useGlobalStore();
  const navigate = useNavigate();

  const rootPath = "/recover";
  const routePathList = ["/", "/:token"];

  useEffect(() => {
    checkPath({ rootPath, routePathList });
    recoverTokenCheck();
  }, []);

  const handleClickButton = async () => {
    await recoverConfirm();
    navigate("/", { replace: true });
  };

  const handleKeyEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClickButton();
    }
  };

  const renderPage = () => {
    if (globalState.pageInvalid) {
      return <ErrorPage />;
    }

    if (
      userState.userRecoverTokenCheck &&
      !userState.userRecoverTokenVerified
    ) {
      return <ErrorPage />;
    }

    if (userState.userRecoverTokenCheck && userState.userRecoverTokenVerified) {
      return (
        <div className={"flex h-full w-full items-center justify-center"}>
          <div className={"w-96 rounded bg-modalGray px-8 py-8 text-white"}>
            <div className={"mb-6 text-center text-xl font-semibold"}>
              비밀번호 변경하기
            </div>

            <div className={"mb-1 text-xs font-semibold text-gray-400"}>
              새 비밀번호
            </div>
            <input
              type={"password"}
              onKeyDown={(e) => handleKeyEnter(e)}
              onChange={(e) => setUserState({ password: e.target.value })}
              className={"mx-auto mb-4 w-full rounded bg-customGray px-2 py-2"}
            />
            <button
              onClick={() => handleClickButton()}
              className={
                "w-full rounded bg-indigo-500 py-2 hover:bg-indigo-600"
              }
            >
              비밀번호 변경하기
            </button>
          </div>
        </div>
      );
    }
  };

  return renderPage();
}
