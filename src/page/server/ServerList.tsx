import { useServerStore } from "../../store/ServerStore.tsx";
import { ChannelInfo, ServerInfo } from "../../../index";
import { useNavigate } from "react-router-dom";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import { useChannelStore } from "../../store/ChannelStore.tsx";
import useFetchNotification from "../../hook/user/useFetchNotification.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import { useEffect } from "react";

export default function ServerList() {
  const { serverState, setServerState, serverListState, setServerListState } =
    useServerStore();
  const { setServerAddState } = useServerAddStore();
  const { channelListState } = useChannelStore();
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

  useEffect(() => {
    // 읽지않은 메시지가 있는 채널
    const channelWithUnreadMessage = channelListState.filter(
      (channel: ChannelInfo) => {
        return (
          channel.lastMessageId !== undefined &&
          channel.lastMessageId !== channel.lastReadMessageId
        );
      },
    );

    // 읽지않은 메시지가 있는 서버
    const serverList = serverListState.map((server: ServerInfo) => {
      // 읽지않은 메시지가 있는 채널에 해당하는 서버 찾기
      const hasUnreadMessage = channelWithUnreadMessage.some(
        (channel: ChannelInfo) => channel.serverId === server.id,
      );
      return {
        ...server,
        newMessage: hasUnreadMessage,
      };
    });
    setServerListState(serverList);
  }, [channelListState]);

  return (
    <div
      className={
        "flex h-full max-h-full w-20 flex-col items-center justify-center gap-2 bg-customDark_0 py-2 pr-1 text-customText"
      }
    >
      <div
        className={
          "custom-scrollbar mx-auto flex h-full max-h-full flex-col items-center gap-2 overflow-y-auto py-2 pl-2"
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
          <div key={server.id} className={""}>
            <div className={"relative"}>
              {server.newMessage ? (
                <svg
                  style={{ left: "-16px" }}
                  className={"absolute top-4"}
                  width="20px"
                  height="20px"
                  viewBox="-2 0 24 24"
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
                      className={"fill-white stroke-white"}
                      d="M9 7.9313V16.0686C9 16.6744 9 16.9773 9.1198 17.1175C9.22374 17.2393 9.37967 17.3038 9.53923 17.2913C9.72312 17.2768 9.93731 17.0626 10.3657 16.6342L14.4343 12.5656C14.6323 12.3676 14.7313 12.2686 14.7684 12.1544C14.8011 12.054 14.8011 11.9458 14.7684 11.8454C14.7313 11.7313 14.6323 11.6323 14.4343 11.4342L10.3657 7.36561C9.93731 6.93724 9.72312 6.72305 9.53923 6.70858C9.37967 6.69602 9.22374 6.76061 9.1198 6.88231C9 7.02257 9 7.32548 9 7.9313Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
              ) : null}
            </div>

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
