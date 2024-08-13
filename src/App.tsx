import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useGlobalStore } from "./store/GlobalStore.tsx";
import useFetchProfile from "./hook/useFetchProfile.tsx";
import Register from "./page/user/register/Register.tsx";
import Login from "./page/user/Login.tsx";
import ErrorPage from "./page/ErrorPage.tsx";
import { getCookie } from "./Cookie.tsx";
import { useTokenStore } from "./store/TokenStore.tsx";
import useRefreshAccessToken from "./hook/useRefreshAccessToken.tsx";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const { fetchProfile } = useFetchProfile();
  const { refreshAccessToken } = useRefreshAccessToken();
  const { globalState, setGlobalState } = useGlobalStore();
  const { tokenState } = useTokenStore();

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

  const refreshToken = getCookie(tokenState.refreshTokenKey);
  useEffect(() => {
    if (refreshToken) {
      void refreshAccessToken(refreshToken);
    }
  }, []);

  useEffect(() => {
    if (tokenState.accessToken) {
      void fetchProfile();
    }
  }, [tokenState.accessToken]);

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

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
        />
      </div>
    );
  };

  return renderPage();
}
