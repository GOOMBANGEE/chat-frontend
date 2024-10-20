import { useServerStore } from "../../store/ServerStore.tsx";
import { ServerInfo } from "../../../index";
import { useNavigate } from "react-router-dom";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import { useChannelStore } from "../../store/ChannelStore.tsx";
import useFetchNotification from "../../hook/user/useFetchNotification.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";

export default function ServerList() {
  const { serverState, setServerState, serverListState } = useServerStore();
  const { setServerAddState } = useServerAddStore();
  const { setChannelState, channelListState } = useChannelStore();
  const { userState } = useUserStore();
  const { envState } = useEnvStore();

  const navigate = useNavigate();
  const { fetchNotification } = useFetchNotification();
  const handleClickMainButton = () => {
    fetchNotification();
    setServerState({
      isHoverDmButton: false,
      hoverButtonY: undefined,
    });
    navigate("/server");
  };

  const handleClickServerIcon = async (server: ServerInfo) => {
    if (serverState.id === server.id) return;
    setServerState({
      id: server.id,
      name: server.name,
      icon: server.icon,
      serverUserList: false,

      isHover: false,
      hoverServerId: undefined,
      hoverServerName: undefined,
      hoverButtonY: undefined,
    });

    // 해당 서버의 채널 리스트를 필터링하고 displayOrder에 따라 정렬
    const sortedChannels = channelListState
      .filter((channel) => channel.serverId === server.id)
      .sort((a, b) => {
        const orderA = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });

    // displayOrder가 가장 작은 채널로 이동
    const firstChannel = sortedChannels[0];
    setChannelState({ id: firstChannel.id, name: firstChannel.name });

    navigate(`/server/${server.id}/${firstChannel.id}`);
  };

  const handleClickServerAddButton = () => {
    setServerAddState({
      name: `${userState.username}의 서버`,
      open: true,
    });
    setServerState({
      isHoverAddButton: false,
      hoverButtonY: undefined,
    });
  };

  return (
    <div
      className={
        "flex h-full max-h-full w-20 flex-col items-center justify-center gap-2 bg-customDark_0 px-1 py-2 text-customText"
      }
    >
      <div
        className={
          "custom-scrollbar mx-auto flex h-full max-h-full flex-col items-center gap-2 overflow-y-auto px-1 py-2"
        }
      >
        {/* dm, server index button */}
        <div>
          <button
            onClick={() => handleClickMainButton()}
            onMouseOver={(e) =>
              setServerState({
                isHoverDmButton: true,
                hoverButtonY: e.currentTarget.getBoundingClientRect().top,
              })
            }
            onMouseLeave={() =>
              setServerState({
                isHoverDmButton: false,
                hoverButtonY: undefined,
              })
            }
            className={
              "group flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-customDark_3 transition duration-100 hover:rounded-2xl hover:bg-indigo-500"
            }
          >
            <svg
              width="32px"
              height="32px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  className={"group-hover:stroke-white"}
                  d="M14 21.0001V15.0001H10V21.0001M19 9.77818V16.2001C19 17.8802 19 18.7203 18.673 19.362C18.3854 19.9265 17.9265 20.3855 17.362 20.6731C16.7202 21.0001 15.8802 21.0001 14.2 21.0001H9.8C8.11984 21.0001 7.27976 21.0001 6.63803 20.6731C6.07354 20.3855 5.6146 19.9265 5.32698 19.362C5 18.7203 5 17.8802 5 16.2001V9.77753M21 12.0001L15.5668 5.96405C14.3311 4.59129 13.7133 3.9049 12.9856 3.65151C12.3466 3.42894 11.651 3.42899 11.0119 3.65165C10.2843 3.90516 9.66661 4.59163 8.43114 5.96458L3 12.0001"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </button>
          {serverState.isHoverDmButton ? (
            <div
              style={{
                top: `${serverState.hoverButtonY ? serverState.hoverButtonY + 4 : 0}px`,
                left: "86px",
              }}
              className={
                "absolute z-10 w-fit rounded bg-black px-4 py-2 font-semibold"
              }
            >
              다이렉트 메시지
            </div>
          ) : null}
        </div>

        {/* server icon */}
        {serverListState.map((server: ServerInfo) => (
          <div key={server.id}>
            {server.icon ? (
              <button
                onMouseOver={(e) =>
                  setServerState({
                    isHover: true,
                    hoverServerId: server.id,
                    hoverServerName: server.name,
                    hoverButtonY: e.currentTarget.getBoundingClientRect().top,
                  })
                }
                onMouseLeave={() =>
                  setServerState({
                    isHover: false,
                    hoverServerId: undefined,
                    hoverServerName: undefined,
                    hoverButtonY: undefined,
                  })
                }
                onClick={() => handleClickServerIcon(server)}
                className={`group flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-x-hidden bg-customDark_3 transition duration-100 ${server.id === serverState.id ? "rounded-2xl" : "rounded-full hover:rounded-2xl"}`}
              >
                <img
                  src={envState.baseUrl + server.icon}
                  className={`h-14 w-14 ${server.id === serverState.id ? "rounded-2xl" : "rounded-full group-hover:rounded-2xl"}`}
                  loading={"lazy"}
                />
              </button>
            ) : (
              <button
                onMouseOver={(e) =>
                  setServerState({
                    isHover: true,
                    hoverServerId: server.id,
                    hoverServerName: server.name,
                    hoverButtonY: e.currentTarget.getBoundingClientRect().top,
                  })
                }
                onMouseLeave={() =>
                  setServerState({
                    isHover: false,
                    hoverServerId: undefined,
                    hoverServerName: undefined,
                    hoverButtonY: undefined,
                  })
                }
                onClick={() => handleClickServerIcon(server)}
                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-x-hidden transition duration-100 ${server.id === serverState.id ? "rounded-2xl bg-indigo-500" : "rounded-full bg-customDark_3 hover:rounded-2xl hover:bg-indigo-500"}`}
              >
                {server.name[0]}
              </button>
            )}
            {serverState.isHover && server.id === serverState.hoverServerId ? (
              <div
                style={{
                  top: `${serverState.hoverButtonY ? serverState.hoverButtonY + 4 : 0}px`,
                  left: "86px",
                }}
                className={
                  "absolute z-10 w-fit rounded bg-black px-4 py-2 font-semibold"
                }
              >
                {serverState.hoverServerName}
              </div>
            ) : null}
          </div>
        ))}

        {/* server add button */}
        <div>
          <button
            onClick={() => handleClickServerAddButton()}
            onMouseOver={(e) =>
              setServerState({
                isHoverAddButton: true,
                hoverButtonY: e.currentTarget.getBoundingClientRect().top,
              })
            }
            onMouseLeave={() =>
              setServerState({
                isHoverAddButton: false,
                hoverButtonY: undefined,
              })
            }
            className={
              "group flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-customDark_3 transition duration-100 hover:rounded-2xl hover:bg-green-600"
            }
          >
            <svg
              width="32px"
              height="32px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  className={"group-hover:stroke-white"}
                  d="M6 12H18M12 6V18"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
          {serverState.isHoverAddButton ? (
            <div
              style={{
                top: `${serverState.hoverButtonY ? serverState.hoverButtonY + 4 : 0}px`,
                left: "86px",
              }}
              className={
                "absolute z-10 w-fit rounded bg-black px-4 py-2 font-semibold"
              }
            >
              서버 추가하기
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
