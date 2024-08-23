import { Route, Routes } from "react-router-dom";
import { useGlobalStore } from "../../../store/GlobalStore.tsx";
import RegisterForm from "./RegisterForm.tsx";
import RegisterConfirm from "./RegisterConfirm.tsx";
import ErrorPage from "../../ErrorPage.tsx";
import RegisterEmail from "./RegisterEmail.tsx";
import useCheckPath from "../../../hook/useCheckPath.tsx";
import { useEffect } from "react";

export default function Register() {
  const { checkPath } = useCheckPath();
  const { globalState } = useGlobalStore();

  const rootPath = "/register";
  const routePathList = ["", "/email", "/confirm/:token", "/success"];

  useEffect(() => {
    checkPath({ rootPath, routePathList });
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
        </Routes>
      </div>
    );
  };

  return renderPage();
}
