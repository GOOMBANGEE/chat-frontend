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

  // accept & reject
  const handleClickAccept = async (
    friendId: number,
    friendUsername: string,
  ) => {
    if (userState.id && userState.username) {
      setUserState({
        isHoverAcceptButton: false,
        hoverButtonY: undefined,
      });
      await friendRequestAccept({
        id: userState.id,
        username: userState.username,
        friendId,
        friendUsername,
      });
    }
  };
  const handleClickReject = async (id: number) => {
    setUserState({
      isHoverRejectButton: false,
      hoverButtonY: undefined,
    });
    await friendRequestReject({ id });
  };

  const renderPage = () => {
    if (userFriendWaitingListState.length > 0) {
      return (
        <div className={"relative h-full w-full px-6 py-6 text-customText"}>
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
          <div className={"w-full"}>
            {/* friend waiting list */}
            {displayFriendWaitingList.map((user) => (
              <div
                key={user.id}
                className={
                  "flex w-full items-center rounded px-4 py-2 hover:bg-customDark_5"
                }
              >
                <div>{user.username}</div>
                <div className={"ml-auto flex gap-x-2"}>
                  {/* accept button */}
                  <button
                    onClick={() => handleClickAccept(user.id, user.username)}
                    onMouseOver={(e) =>
                      setUserState({
                        isHoverAcceptButton: true,
                        hoverButtonY:
                          e.currentTarget.getBoundingClientRect().top,
                      })
                    }
                    onMouseLeave={() =>
                      setUserState({
                        isHoverAcceptButton: false,
                        hoverButtonY: undefined,
                      })
                    }
                    className={"group"}
                  >
                    <svg
                      className={"h-8 w-8 rounded-full bg-customDark_0 p-1"}
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
                          className={
                            "stroke-customGray_4 group-hover:stroke-green-500"
                          }
                          d="M4 12.6111L8.92308 17.5L20 6.5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </button>
                  {userState.isHoverAcceptButton ? (
                    <div
                      style={{
                        top: `${userState.hoverButtonY ? userState.hoverButtonY - 10 : 0}px`,
                        right: "68px",
                      }}
                      className={
                        "absolute z-10 w-fit rounded bg-black px-3 py-1.5 font-semibold"
                      }
                    >
                      수락
                    </div>
                  ) : null}

                  {/* reject button */}
                  <button
                    onClick={() => handleClickReject(user.id)}
                    onMouseOver={(e) =>
                      setUserState({
                        isHoverRejectButton: true,
                        hoverButtonY:
                          e.currentTarget.getBoundingClientRect().top,
                      })
                    }
                    onMouseLeave={() =>
                      setUserState({
                        isHoverRejectButton: false,
                        hoverButtonY: undefined,
                      })
                    }
                    className={"group"}
                  >
                    <svg
                      className={"h-8 w-8 rounded-full bg-customDark_0 p-1"}
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
                          className={
                            "stroke-customGray_4 group-hover:stroke-red-500"
                          }
                          d="M6 6L18 18M18 6L6 18"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </button>
                  {userState.isHoverRejectButton ? (
                    <div
                      style={{
                        top: `${userState.hoverButtonY ? userState.hoverButtonY - 10 : 0}px`,
                        right: "28px",
                      }}
                      className={
                        "absolute z-10 w-fit rounded bg-black px-3 py-1.5 font-semibold"
                      }
                    >
                      거절
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        className={
          "flex items-center justify-center py-6 font-semibold text-gray-300"
        }
      >
        새로운 친구신청이 없습니다
      </div>
    );
  };

  return renderPage();
}
