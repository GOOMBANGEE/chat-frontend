import { useGlobalStore } from "../../store/GlobalStore.tsx";
import { useEffect } from "react";
import { matchPath, Route, Routes } from "react-router-dom";
import ErrorPage from "../ErrorPage.tsx";
import ServerList from "./ServerList.tsx";
import ServerIndex from "./serverIndex/ServerIndex.tsx";
import ServerChat from "./serverChat/ServerChat.tsx";
import useFetchServerList from "../../hook/server/useFetchServerList.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import ServerAddModal from "./ServerAddModal.tsx";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";

export default function Server() {
  const { fetchServerList } = useFetchServerList();
  const { userState } = useUserStore();
  const { serverAddState } = useServerAddStore();
  const { globalState, setGlobalState } = useGlobalStore();

  const rootPath = "/";
  const routePathList = ["", ":serverId"];

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
    if (userState.username) {
      fetchServerList();
    }
  }, [userState.username]);

  const renderPage = () => {
    if (globalState.pageInvalid) {
      return <ErrorPage />;
    }

    return (
      <div className={"flex h-full w-full text-white"}>
        <div className={"w-20"}>
          <ServerList />
        </div>
        <div className={"w-full"}>
          <Routes>
            <Route index element={<ServerIndex />} />
            <Route path={":serverId"} element={<ServerChat />} />
          </Routes>
        </div>

        {serverAddState.open ? <ServerAddModal /> : null}
      </div>
    );
  };

  return renderPage();
}
