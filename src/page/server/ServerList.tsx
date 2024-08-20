import { useServerStore } from "../../store/ServerStore.tsx";
import { Server } from "../../../index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { useUserStore } from "../../store/UserStore.tsx";

export default function ServerList() {
  const { setServerState } = useServerStore();
  const { setServerAddState } = useServerAddStore();
  const { serverListState } = useServerStore();
  const { userState } = useUserStore();

  const navigate = useNavigate();

  const [isHover, setIsHover] = useState(false);

  const handleServerIconClick = (server: Server) => {
    setServerState({ id: server.id, name: server.name });
    navigate(`/server/${server.id}`);
  };

  return (
    <div
      className={
        "mx-auto flex h-full flex-col items-center gap-2 bg-serverListSidebar px-1 py-2"
      }
    >
      {serverListState.map((server: Server) => (
        <button
          key={server.id}
          onClick={() => handleServerIconClick(server)}
          className={
            "flex h-12 w-12 items-center justify-center rounded-full bg-customGray"
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
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 transition duration-100"
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
            "flex h-12 w-12 items-center justify-center rounded-full bg-customGray transition duration-100"
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
  );
}
