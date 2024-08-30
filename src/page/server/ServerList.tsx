import { useServerStore } from "../../store/ServerStore.tsx";
import { ServerInfo } from "../../../index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";
import { useChatStore } from "../../store/ChatStore.tsx";
import useFetchChatList from "../../hook/server/serverChat/useFetchChatList.tsx";

export default function ServerList() {
  const { fetchChatList } = useFetchChatList();

  const { resetChatListState } = useChatStore();
  const { setServerState } = useServerStore();
  const { setServerAddState } = useServerAddStore();
  const { serverListState } = useServerStore();
  const { userState } = useUserStore();

  const navigate = useNavigate();

  const [isHover, setIsHover] = useState(false);

  const handleClickMainButton = () => {
    navigate("/server");
  };

  const handleClickServerIcon = (server: ServerInfo) => {
    setServerState({ id: server.id, name: server.name, serverUserList: false });
    resetChatListState();

    // fetch serverChat log limit 50
    fetchChatList({ serverId: server.id });
    navigate(`/server/${server.id}`);
  };

  return (
    <div
      className={
        "flex h-full max-h-full w-20 flex-col items-center justify-center gap-2 bg-serverListSidebar px-1 py-2"
      }
    >
      <div
        className={
          "custom-scrollbar mx-auto flex h-full max-h-full flex-col items-center gap-2 overflow-y-auto px-1 py-2"
        }
      >
        <button
          onClick={() => handleClickMainButton()}
          className={
            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-customGray"
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
                d="M14 21.0001V15.0001H10V21.0001M19 9.77818V16.2001C19 17.8802 19 18.7203 18.673 19.362C18.3854 19.9265 17.9265 20.3855 17.362 20.6731C16.7202 21.0001 15.8802 21.0001 14.2 21.0001H9.8C8.11984 21.0001 7.27976 21.0001 6.63803 20.6731C6.07354 20.3855 5.6146 19.9265 5.32698 19.362C5 18.7203 5 17.8802 5 16.2001V9.77753M21 12.0001L15.5668 5.96405C14.3311 4.59129 13.7133 3.9049 12.9856 3.65151C12.3466 3.42894 11.651 3.42899 11.0119 3.65165C10.2843 3.90516 9.66661 4.59163 8.43114 5.96458L3 12.0001"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </button>
        {serverListState.map((server: ServerInfo) => (
          <button
            key={server.id}
            onClick={() => handleClickServerIcon(server)}
            className={
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-customGray"
            }
          >
            {server.id}
          </button>
        ))}

        {isHover ? (
          <button
            onMouseLeave={() => setIsHover(false)}
            onClick={() =>
              setServerAddState({
                name: `${userState.username}의 서버`,
                open: true,
              })
            }
            className={
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-600 transition duration-100"
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
                  d="M6 12H18M12 6V18"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
        ) : (
          <button
            onMouseOver={() => setIsHover(true)}
            className={
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-customGray transition duration-100"
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
                  d="M6 12H18M12 6V18"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
