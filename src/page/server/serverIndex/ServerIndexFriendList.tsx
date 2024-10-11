import { useUserStore } from "../../../store/UserStore.tsx";
import React, { useEffect } from "react";
import { ChannelInfo, UserInfo } from "../../../../index";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";
import useChannelCreate from "../../../hook/server/serverChat/channel/useChannelCreate.tsx";
import { useNavigate } from "react-router-dom";

export default function ServerIndexFriendList() {
  const { channelCreate } = useChannelCreate();
  const { setChannelState, channelListState } = useChannelStore();
  const {
    userState,
    setUserState,
    userFriendListState,
    userFriendSearchListState,
    setUserFriendSearchListState,
  } = useUserStore();
  const { envState } = useEnvStore();
  const navigate = useNavigate();

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

  // dm
  const handleClickDirectMessageButton = async (userId: number) => {
    // 해당 유저와의 채널이 있는지 확인
    const channel = channelListState.find(
      (channel: ChannelInfo) => channel.userDirectMessageId === userId,
    );

    // 채널이 없는경우 채널 생성 후 이동
    if (!channel) {
      const channelId = await channelCreate({ userId: userId });
      navigate(`/server/dm/${channelId}`);
    } else {
      setChannelState({ id: channel.id, userDirectMessageId: userId });
      navigate(`/server/dm/${channel.id}`);
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
                "flex w-full items-center gap-4 rounded px-4 py-2 hover:bg-customDark_5"
              }
            >
              {user.avatarImageSmall ? (
                <img
                  src={envState.baseUrl + user.avatarImageSmall}
                  className={"h-12 w-12 rounded-full"}
                />
              ) : (
                <div
                  className={
                    "flex h-12 w-12 items-center justify-center rounded-full bg-customDark_5"
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
                        d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                        className={"stroke-customGray_4"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                </div>
              )}
              <div>
                <div>{user.username}</div>

                <div>{user.online ? "온라인" : "오프라인"}</div>
              </div>
              <button
                onClick={() => handleClickDirectMessageButton(user.id)}
                className={"group ml-auto rounded-full bg-customDark_0 p-2"}
              >
                <svg
                  width="22px"
                  height="22px"
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
                        "fill-customGray_4 stroke-customGray_4 group-hover:fill-white group-hover:stroke-white"
                      }
                      d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
              </button>
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
