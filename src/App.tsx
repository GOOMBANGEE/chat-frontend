import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useGlobalStore } from "./store/GlobalStore.tsx";
import useFetchProfile from "./hook/useFetchProfile.tsx";
import Register from "./page/user/Register.tsx";
import Login from "./page/user/Login.tsx";
import ErrorPage from "./page/ErrorPage.tsx";

export default function App() {
  const { fetchProfile } = useFetchProfile();
  const { globalState, setGlobalState } = useGlobalStore();
  const location = useLocation();

  const rootPath = "/";
  const routePathList = ["", "register/*"];

  useEffect(() => {
    if (
      !routePathList.some((path) =>
        matchPath(rootPath + path, location.pathname),
      )
    ) {
      setGlobalState({ pageInvalid: true });
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [location.pathname]);

  const renderPage = () => {
    if (globalState.pageInvalid) {
      return <ErrorPage />;
    }

    return (
      <div className={"h-full select-none"}>
        <Routes>
          <Route index element={<Login />} />
          <Route path={"register/*"} element={<Register />} />
        </Routes>
      </div>
    );
  };

  return renderPage();
}
