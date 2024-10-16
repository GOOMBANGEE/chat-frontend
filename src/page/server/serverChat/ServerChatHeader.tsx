import { useServerStore } from "../../../store/ServerStore.tsx";
import ChatSearchbar from "./chat/ChatSearchbar.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";
import { useEffect, useState } from "react";
import { ChannelInfo } from "../../../../index";
import NotificationIcon from "../../../component/NotificationIcon.tsx";
import AvatarIcon from "../../../component/AvatarIcon.tsx";

export default function ServerChatHeader() {
  const { serverState, setServerState } = useServerStore();
  const { channelState, setChannelState, directMessageChannelListState } =
    useChannelStore();

  const [channelInfo, setChannelInfo] = useState<ChannelInfo>();

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
      const channelInfo = directMessageChannelListState.find(
        (channelInfo: ChannelInfo) => channelInfo.id === channelState.id,
      );
      setChannelState({
        name: channelInfo?.username,
        userDirectMessageAvatar: channelInfo?.avatarImageSmall,
      });
      setChannelInfo(channelInfo);
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
            className={"group ml-auto mr-2 rounded"}
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
            <AvatarIcon avatar={channelInfo?.avatarImageSmall} size={8} />

            <div className={"ml-4"}>{channelInfo?.username}</div>
          </div>
        </div>
      )}
      <NotificationIcon />
      <ChatSearchbar />
    </div>
  );
}
