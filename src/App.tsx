import { Route, Routes } from "react-router-dom";
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
import Server from "./page/server/Server.tsx";
import useCheckPath from "./hook/useCheckPath.tsx";
import Invite from "./page/server/Invite.tsx";
import UserSetting from "./page/user/userSetting/UserSetting.tsx";
import { useUserStore } from "./store/UserStore.tsx";
import { useServerStore } from "./store/ServerStore.tsx";
import ServerSetting from "./page/server/serverChat/serverSetting/ServerSetting.tsx";
import Recover from "./page/user/recover/Recover.tsx";
import { useChannelStore } from "./store/ChannelStore.tsx";
import ChannelSetting from "./page/server/serverChat/channel/channelSetting/ChannelSetting.tsx";

export default function App() {
  const { fetchProfile } = useFetchProfile();
  const { refreshAccessToken } = useRefreshAccessToken();
  const { checkPath } = useCheckPath();

  const { userState } = useUserStore();
  const { serverState } = useServerStore();
  const { channelState } = useChannelStore();
  const { tokenState } = useTokenStore();
  const { globalState, setGlobalState } = useGlobalStore();

  const routePathList = [
    "/",
    "register/*",
    "recover/*",
    "server/*",
    "invite/*",
  ];

  useEffect(() => {
    checkPath({ routePathList: routePathList });
  }, []);

  // accessToken 가져오기
  const refreshToken = getCookie(tokenState.refreshTokenKey);
  const fetchAccessToken = async () => {
    if (!(await refreshAccessToken(refreshToken))) {
      setGlobalState({ fetchProfile: true });
    }
  };
  useEffect(() => {
    if (refreshToken) {
      fetchAccessToken();
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
          <Route path={"recover/:token"} element={<Recover />} />
          <Route path={"server/*"} element={<Server />} />
          <Route path={"invite/:code"} element={<Invite />} />
        </Routes>

        {userState.userSettingOpen ? <UserSetting /> : null}
        {serverState.settingModalOpen ? <ServerSetting /> : null}
        {channelState.settingModalOpen ? <ChannelSetting /> : null}

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
