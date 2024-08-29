import { useServerStore } from "../../../store/ServerStore.tsx";

export default function ServerChatHeader() {
  const { serverState, setServerState } = useServerStore();

  const handleClickUserListButton = () => {
    setServerState({ serverUserList: !serverState.serverUserList });
  };

  return (
    <div
      className={"flex w-full items-center px-6 py-3 font-semibold shadow-md"}
    >
      <div>{serverState.name}</div>
      <button
        onClick={() => handleClickUserListButton()}
        className={"group ml-auto rounded"}
      >
        <svg
          width="24px"
          height="24px"
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
              d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
              className={`${serverState.serverUserList ? "stroke-white group-hover:stroke-gray-500" : "stroke-gray-400 group-hover:stroke-gray-500"}`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </button>
    </div>
  );
}
