import { useUserStore } from "../../../store/UserStore.tsx";
import { useEffect } from "react";
import useFriendRequestAccept from "../../../hook/user/useFriendRequestAccept.tsx";
import useFriendRequestReject from "../../../hook/user/useFriendRequestReject.tsx";

export default function ServerIndexFriendWaitingList() {
  const { friendRequestAccept } = useFriendRequestAccept();
  const { friendRequestReject } = useFriendRequestReject();
  const {
    userState,
    setUserState,
    userFriendWaitingListState,
    userFriendSearchListState,
    setUserFriendSearchListState,
  } = useUserStore();

  // 목록 검색
  const displayFriendWaitingList = userState.searchUsername
    ? userFriendSearchListState
    : userFriendWaitingListState;
  useEffect(() => {
    const searchFriendList = userFriendWaitingListState.filter((user) => {
      if (userState.searchUsername) {
        return user.username
          .toLowerCase()
          .includes(userState.searchUsername.toLowerCase());
      }
    });
    setUserFriendSearchListState(searchFriendList);
  }, [userState.searchUsername]);

  const handleClickAccept = async (id: number, username: string) => {
    await friendRequestAccept({ id, username });
  };
  const handleClickReject = async (id: number, username: string) => {
    await friendRequestReject({ id, username });
  };

  return (
    <div className={"h-full w-full px-6 py-4"}>
      {userFriendWaitingListState.length > 0 ? (
        <>
          <div
            className={"bg-searchbar relative mb-4 w-full rounded px-2 py-1"}
          >
            <input
              onChange={(e) => setUserState({ searchUsername: e.target.value })}
              placeholder={"검색하기"}
              className={"bg-searchbar w-full px-2 py-1 outline-none"}
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
                    d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
          <div className={"w-full"}>
            {displayFriendWaitingList.map((user) => (
              <div
                key={user.id}
                className={
                  "flex w-full items-center rounded px-4 py-2 hover:bg-customGray"
                }
              >
                <div>{user.username}</div>
                {user.id}
                <div className={"ml-auto flex gap-x-2"}>
                  <button
                    onClick={() => handleClickAccept(user.id, user.username)}
                    className={"group"}
                  >
                    <svg
                      className={"bg-buttonDark h-8 w-8 rounded-full p-1"}
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
                          className={"group-hover:stroke-green-500"}
                          d="M4 12.6111L8.92308 17.5L20 6.5"
                          stroke="#9ca3af"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleClickReject(user.id, user.username)}
                    className={"group"}
                  >
                    <svg
                      className={"bg-buttonDark h-8 w-8 rounded-full p-1"}
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
                          className={"group-hover:stroke-red-500"}
                          d="M6 6L18 18M18 6L6 18"
                          stroke="#9ca3af"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          className={
            "flex items-center justify-center font-semibold text-gray-300"
          }
        >
          새로운 친구신청이 없습니다
        </div>
      )}
    </div>
  );
}
