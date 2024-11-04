import { Route, Routes, useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../store/GlobalStore.tsx";
import RegisterForm from "./RegisterForm.tsx";
import RegisterConfirm from "./RegisterConfirm.tsx";
import ErrorPage from "../../ErrorPage.tsx";
import RegisterEmail from "./RegisterEmail.tsx";
import useCheckPath from "../../../hook/useCheckPath.tsx";
import { useEffect } from "react";
import { useUserStore } from "../../../store/UserStore.tsx";

export default function Register() {
  const { checkPath } = useCheckPath();
  const { userState } = useUserStore();
  const { globalState } = useGlobalStore();

  const navigate = useNavigate();
  const serverUrl = "/server";

  const rootPath = "/register";
  const routePathList = ["", "/email", "/confirm/:token", "/success"];

  useEffect(() => {
    checkPath({ rootPath, routePathList });
  }, []);

  // 로그인 상태라면 server로 리다이렉트
  useEffect(() => {
    if (userState.login) {
      navigate(serverUrl);
    }
  }, [userState.login]);

  const renderPage = () => {
    if (globalState.pageInvalid) {
      return <ErrorPage />;
    }

    return (
      <div className={"h-full"}>
        <Routes>
          <Route index element={<RegisterForm />} />
          <Route path={"email"} element={<RegisterEmail />} />
          {/* userState.email 로 메일이 발송되었습니다. 계정을 인증해야 해요. + 재발송버튼 */}
          <Route path={"confirm/:token"} element={<RegisterConfirm />} />
        </Routes>
      </div>
    );
  };

  return renderPage();
}
