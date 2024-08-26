import { useServerStore } from "../../store/ServerStore.tsx";
import { useEffect } from "react";
import useFetchServerInfo from "../../hook/server/useFetchServerInfo.tsx";
import useServerJoin from "../../hook/server/useServerJoin.tsx";
import ErrorPage from "../ErrorPage.tsx";
import Loading from "../../component/Loading.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import { useNavigate } from "react-router-dom";

export default function Invite() {
  const { fetchServerInfo } = useFetchServerInfo();
  const { serverJoin } = useServerJoin();

  const { serverState, setServerState } = useServerStore();
  const { userState } = useUserStore();
  const navigate = useNavigate();

  const handleClickJoinButton = async () => {
    const serverId = await serverJoin();
    navigate(`/server/${serverId}`);
  };

  useEffect(() => {
    fetchServerInfo();

    return () => {
      setServerState({ fetchServerInfo: false });
    };
  }, [userState.username]);

  const renderPage = () => {
    if (!serverState.fetchServerInfo) {
      return <Loading />;
    }

    if (serverState.fetchServerInfo && !serverState.inviteUsername) {
      return <ErrorPage />;
    }

    if (serverState.fetchServerInfo && serverState.inviteUsername) {
      return (
        <div
          className={
            "fixed left-0 top-0 flex h-full w-full items-center justify-center"
          }
        >
          <div className={"server-add-modal flex items-center justify-center"}>
            <div
              style={{ width: "450px" }}
              className={
                "absolute mx-4 flex flex-col rounded bg-modalGray px-2 text-center"
              }
            >
              <div
                className={
                  "relative flex flex-col items-center px-4 py-4 text-start font-semibold text-white"
                }
              >
                <div className={"mb-4 text-center"}>
                  <div>{serverState.inviteUsername} 님이 초대함:</div>
                  <div>서버명 : {serverState.name}</div>
                  <div>멤버 : {serverState.userCount}명</div>
                </div>

                <button
                  onClick={() => {
                    handleClickJoinButton();
                  }}
                  className={
                    "w-full rounded bg-indigo-500 py-2 text-center hover:bg-indigo-400"
                  }
                >
                  참가하기
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return renderPage();
}