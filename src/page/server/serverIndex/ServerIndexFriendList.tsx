import { useUserStore } from "../../../store/UserStore.tsx";
import React, { useEffect } from "react";
import { UserInfo } from "../../../../index";

export default function ServerIndexFriendList() {
  const {
    userState,
    setUserState,
    userFriendListState,
    userFriendSearchListState,
    setUserFriendSearchListState,
  } = useUserStore();

  // 목록 검색
  const displayFriendList = userState.searchUsername
    ? userFriendSearchListState
    : userFriendListState;
  useEffect(() => {
    const searchFriendList = userFriendListState.filter((user) => {
      if (userState.searchUsername) {
        return user.username
          .toLowerCase()
          .includes(userState.searchUsername.toLowerCase());
      }
    });
    setUserFriendSearchListState(searchFriendList);
  }, [userState.searchUsername]);

  const handleContextMenu = (e: React.MouseEvent, userInfo: UserInfo) => {
    e.preventDefault();
    if (userInfo.id !== userState.id) {
      setUserState({
        userContextMenu: true,
        focusUserId: userInfo.id,
        focusUsername: userInfo.username,
      });
    }
  };

  const renderPage = () => {
    if (userFriendListState.length > 0) {
      return (
        <div className={"h-full w-full px-6 py-6 text-customText"}>
          <div
            className={"relative mb-4 w-full rounded bg-customDark_0 px-2 py-1"}
          >
            <input
              onChange={(e) => setUserState({ searchUsername: e.target.value })}
              placeholder={"검색하기"}
              className={"w-full bg-customDark_0 px-2 py-1 outline-none"}
            />
            <div className={"absolute right-3 top-2.5"}>
              <svg
                className={"ml-auto"}
                width="20px"
                height="20px"
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
                    className={"stroke-customGray_4"}
                    d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
          {displayFriendList.map((user) => (
            <div
              onContextMenu={(e) => handleContextMenu(e, user)}
              key={user.id}
              className={
                "flex w-full items-center rounded px-4 py-2 hover:bg-customDark_5"
              }
            >
              {user.username}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        className={
          "flex items-center justify-center py-6 font-semibold text-gray-300"
        }
      >
        새로운 친구를 추가해보세요
      </div>
    );
  };

  return renderPage();
}
