import { useUserStore } from "../../../store/UserStore.tsx";

export default function ServerIndexFriendHeader() {
  const {
    userState,
    setUserState,
    setUserFriendSearchListState,
    userFriendWaitingListState,
  } = useUserStore();

  const handleClickFriendListButton = () => {
    setUserState({
      indexPageFriendList: true,
      indexPageFriendRequestList: false,
      indexPageFriendAdd: false,
      searchUsername: undefined,
    });
    setUserFriendSearchListState([]);
  };

  const handleClickRequestListButton = () => {
    setUserState({
      indexPageFriendRequestList: true,
      indexPageFriendList: false,
      indexPageFriendAdd: false,
      searchUsername: undefined,
    });
    setUserFriendSearchListState([]);
  };

  const waitingCount = () => {
    if (userFriendWaitingListState.length > 0) {
      return (
        <div
          className={
            "ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white"
          }
        >
          {userFriendWaitingListState.length}
        </div>
      );
    }
  };

  const handleClickFriendAddButton = () => {
    setUserState({
      indexPageFriendAdd: true,
      indexPageFriendList: false,
      indexPageFriendRequestList: false,
      searchUsername: undefined,
    });
    setUserFriendSearchListState([]);
  };

  return (
    <div className={"flex w-full flex-col px-6 py-4 text-customText shadow-md"}>
      <div className={"flex items-center gap-x-6"}>
        <div className={"flex font-semibold"}>
          <svg
            className={"mr-1"}
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
              {" "}
              <path
                className={"stroke-customGray_3"}
                d="M13 20V18C13 15.2386 10.7614 13 8 13C5.23858 13 3 15.2386 3 18V20H13ZM13 20H21V19C21 16.0545 18.7614 14 16 14C14.5867 14 13.3103 14.6255 12.4009 15.6311M11 7C11 8.65685 9.65685 10 8 10C6.34315 10 5 8.65685 5 7C5 5.34315 6.34315 4 8 4C9.65685 4 11 5.34315 11 7ZM18 9C18 10.1046 17.1046 11 16 11C14.8954 11 14 10.1046 14 9C14 7.89543 14.8954 7 16 7C17.1046 7 18 7.89543 18 9Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
          친구
        </div>

        {userState.indexPageFriendList ? (
          <div
            className={
              "rounded bg-customDark_6 px-2 py-0.5 text-white hover:bg-customDark_5"
            }
          >
            전체목록
          </div>
        ) : (
          <button
            onClick={() => handleClickFriendListButton()}
            className={
              "rounded px-2 py-0.5 text-gray-300 hover:bg-customDark_6 hover:text-white"
            }
          >
            전체목록
          </button>
        )}

        {userState.indexPageFriendRequestList ? (
          <div
            className={
              "flex items-center justify-center rounded bg-customDark_6 px-2 py-0.5 hover:bg-customDark_5"
            }
          >
            대기중{waitingCount()}
          </div>
        ) : (
          <button
            onClick={() => handleClickRequestListButton()}
            className={
              "flex items-center justify-center rounded px-2 py-0.5 text-gray-300 hover:bg-customDark_6 hover:text-white"
            }
          >
            대기중{waitingCount()}
          </button>
        )}

        {userState.indexPageFriendAdd ? (
          <div
            className={
              "flex items-center justify-center rounded px-2 py-0.5 text-green-500"
            }
          >
            친구 추가하기
          </div>
        ) : (
          <button
            onClick={() => handleClickFriendAddButton()}
            className={
              "flex items-center justify-center rounded bg-green-700 px-2 py-0.5 text-customText hover:bg-customDark_6 hover:bg-green-800 hover:text-white"
            }
          >
            친구 추가하기
          </button>
        )}
      </div>
    </div>
  );
}
