import { useEffect } from "react";
import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { useGlobalStore } from "../../../store/GlobalStore.tsx";
import RegisterForm from "./RegisterForm.tsx";
import RegisterConfirm from "./RegisterConfirm.tsx";
import RegisterSuccess from "./RegisterSuccess.tsx";
import ErrorPage from "../../ErrorPage.tsx";
import RegisterEmail from "./RegisterEmail.tsx";

export default function Register() {
  const { globalState, setGlobalState } = useGlobalStore();
  const location = useLocation();

  const rootPath = "/register";
  const routePathList = ["", "/email", "/confirm/:token", "/success"];

  useEffect(() => {
    if (
      !routePathList.some((path) =>
        matchPath(rootPath + path, location.pathname),
      )
    ) {
      setGlobalState({ pageInvalid: true });
    }
  }, []);

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
          <Route path={"success"} element={<RegisterSuccess />} />
          {/* registerSuccess -> 가입이 완료되었다는메세지 + 로그인창으로 이동하라는 네비게이터 */}
        </Routes>
      </div>
    );
  };

  return renderPage();
}
