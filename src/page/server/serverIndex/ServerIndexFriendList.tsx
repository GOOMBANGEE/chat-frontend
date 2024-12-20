import { useUserStore } from "../../../store/UserStore.tsx";
import React, { useEffect } from "react";
import { ChannelInfo, UserInfo } from "../../../../index";
import { useChannelStore } from "../../../store/ChannelStore.tsx";
import useChannelCreate from "../../../hook/server/serverChat/channel/useChannelCreate.tsx";
import { useNavigate } from "react-router-dom";
import IconComponent from "../../../component/IconComponent.tsx";

export default function ServerIndexFriendList() {
  const { channelCreate } = useChannelCreate();
  const { directMessageChannelListState } = useChannelStore();
  const {
    userState,
    setUserState,
    userFriendListState,
    userFriendSearchListState,
    setUserFriendSearchListState,
  } = useUserStore();
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
        focusUserAvatar: userInfo.avatarImageSmall,
        menuPositionX: e.clientX,
        menuPositionY: e.clientY,
      });
    }
  };

  // dm
  const handleClickDirectMessageButton = async (userId: number) => {
    // 해당 유저와의 채널이 있는지 확인
    const channel = directMessageChannelListState.find(
      (channel: ChannelInfo) => channel.userDirectMessageId === userId,
    );

    // 채널이 없는경우 채널 생성 후 이동
    if (!channel) {
      const channelId = await channelCreate({
        serverId: undefined,
        userId: userId,
      });
      if (channelId != undefined) navigate(`/server/dm/${channelId}`);
    } else {
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
            <button
              onClick={() => handleClickDirectMessageButton(user.id)}
              onContextMenu={(e) => handleContextMenu(e, user)}
              key={user.id}
              className={
                "flex w-full items-center gap-4 rounded px-4 py-2 text-start hover:bg-customDark_5"
              }
            >
              <IconComponent
                onClick={() => handleClickDirectMessageButton(user.id)}
                icon={user.avatarImageSmall}
                size={12}
              />
              <div>
                <div>{user.username}</div>

                <div>{user.online ? "온라인" : "오프라인"}</div>
              </div>
              <div className={"group ml-auto rounded-full bg-customDark_0 p-2"}>
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
              </div>
            </button>
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
