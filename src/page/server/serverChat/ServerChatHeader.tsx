import { useServerStore } from "../../../store/ServerStore.tsx";
import ChatSearchbar from "./chat/ChatSearchbar.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";
import { useEffect, useState } from "react";
import { useUserStore } from "../../../store/UserStore.tsx";
import { UserInfo } from "../../../../index";
import { useEnvStore } from "../../../store/EnvStore.tsx";

export default function ServerChatHeader() {
  const { serverState, setServerState } = useServerStore();
  const { channelState, setChannelState } = useChannelStore();
  const { userFriendListState } = useUserStore();
  const { envState } = useEnvStore();

  const [userInfo, setUserInfo] = useState<UserInfo>();

  const handleClickUserListButton = () => {
    setServerState({
      serverUserList: !serverState.serverUserList,
      searchList: false,
    });
    setServerState({
      searchbar: false,
      searchOptionMenu: false,
      searchOptionUser: false,
      searchOptionMessage: false,
      searchList: false,
    });
  };

  useEffect(() => {
    // dm으로 들어온경우 userDirectMessageId (userId) 에 해당하는 user의 정보를 찾아서 넣어준다
    if (serverState.id === undefined) {
      const userInfo = userFriendListState.find(
        (user: UserInfo) => user.id === channelState.userDirectMessageId,
      );
      setChannelState({
        name: userInfo?.username,
        userDirectMessageAvatar: userInfo?.avatarImageSmall,
      });
      setUserInfo(userInfo);
    }
  }, [channelState.id]);

  return (
    <div
      className={
        "flex w-full items-center gap-x-2 px-6 font-semibold text-customText shadow-md"
      }
    >
      {serverState.id ? (
        <div className={"my-5 flex w-full"}>
          <div>{channelState.name}</div>
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
                  className={`${serverState.serverUserList ? "stroke-white group-hover:stroke-customGray_4" : "stroke-customGray_4 group-hover:stroke-customGray_2"}`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      ) : (
        // dm
        <div className={"w-full"}>
          <div className={"my-3 flex w-full items-center py-0.5"}>
            {userInfo ? (
              <>
                {userInfo.avatarImageSmall ? (
                  <img
                    src={envState.baseUrl + userInfo?.avatarImageSmall}
                    className={"h-8 w-8 rounded-full"}
                  />
                ) : (
                  <svg
                    className={"mr-2 h-8 w-8"}
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
                        className={"stroke-customGray_4"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                )}
              </>
            ) : (
              <div className={"h-8 w-8"}></div>
            )}

            <div className={"ml-4"}>{userInfo?.username}</div>
            <div className={"ml-auto"}>
              <ChatSearchbar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
