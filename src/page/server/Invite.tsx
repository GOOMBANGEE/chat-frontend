import { useServerStore } from "../../store/ServerStore.tsx";
import { useEffect } from "react";
import useFetchServerInfo from "../../hook/server/useFetchServerInfo.tsx";
import useServerJoin from "../../hook/server/useServerJoin.tsx";
import ErrorPage from "../ErrorPage.tsx";
import Loading from "../../component/Loading.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import { useNavigate, useParams } from "react-router-dom";
import useFetchServerList from "../../hook/server/useFetchServerList.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";

export default function Invite() {
  const { fetchServerInfo } = useFetchServerInfo();
  const { serverJoin } = useServerJoin();
  const { fetchServerList } = useFetchServerList();

  const { serverState, setServerState } = useServerStore();
  const { userState } = useUserStore();
  const { envState } = useEnvStore();
  const { code } = useParams();
  const navigate = useNavigate();

  const handleClickJoinButton = async () => {
    if (code) {
      const response = await serverJoin({ code });
      await fetchServerList();
      navigate(`/server/${response?.id}/${response?.channelId}`);
    }
  };

  useEffect(() => {
    if (userState.username) fetchServerInfo();

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
                "absolute mx-4 flex flex-col rounded bg-customDark_1 px-2 text-center text-customText"
              }
            >
              <div
                className={
                  "relative flex flex-col items-center px-4 py-4 text-start font-semibold"
                }
              >
                <div className={"mb-4 text-center"}>
                  <div>{serverState.inviteUsername} 님이 초대함:</div>
                  <div className={"relative flex items-center"}>
                    {serverState.icon ? (
                      <img
                        style={{ left: "-64px" }}
                        src={envState.baseUrl + serverState.icon}
                        className={
                          "absolute top-0 flex h-14 w-14 items-center justify-center rounded-full"
                        }
                      />
                    ) : (
                      <div
                        style={{ left: "-64px" }}
                        className={
                          "absolute top-0 flex h-14 w-14 items-center justify-center rounded-full bg-customDark_5"
                        }
                      >
                        {serverState.name ? serverState.name[0] : null}
                      </div>
                    )}
                    <div className={"flex flex-col"}>
                      <div>서버명 : {serverState.name}</div>
                      <div>멤버 : {serverState.userCount}명</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleClickJoinButton();
                  }}
                  className={
                    "w-full rounded bg-indigo-500 py-2 text-center hover:bg-indigo-600"
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
