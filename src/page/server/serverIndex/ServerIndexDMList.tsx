import { useEffect, useState } from "react";
import { ChannelInfo } from "../../../../index";
import { useChannelStore } from "../../../store/ChannelStore.tsx";
import { useUserStore } from "../../../store/UserStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { useNavigate } from "react-router-dom";

export default function ServerIndexDMList() {
  const { channelListState } = useChannelStore();
  const { userFriendListState } = useUserStore();
  const { envState } = useEnvStore();

  const [dmChannelList, setDmChannelList] = useState<ChannelInfo[]>();
  const navigate = useNavigate();

  const handleDmChannelClick = (channelId: number) => {
    navigate("/server/dm/" + channelId);
  };

  useEffect(() => {
    const dmChannelList = channelListState.filter((channelInfo) => {
      if (channelInfo.userDirectMessageId !== null) {
        return channelInfo;
      } else {
        return null;
      }
    });
    // 친구 목록에서 dmChannelList에 있는 userDirectMessageId에 해당하는 유저정보 넣기
    setDmChannelList(dmChannelList);
  }, [channelListState]);

  return (
    <div>
      <div className={"relative flex flex-col text-customText"}>
        <div className={"mt-1 flex h-14 w-full items-center shadow-md"}></div>

        {dmChannelList &&
          dmChannelList.map((channelInfo) => {
            const userInfo = userFriendListState.find(
              (user) => user.id === channelInfo.userDirectMessageId,
            );

            return (
              <button
                key={userInfo?.id}
                onClick={() => handleDmChannelClick(channelInfo.id)}
                className={
                  "flex items-center gap-4 rounded px-4 py-2 hover:bg-customDark_5"
                }
              >
                {userInfo?.avatarImageSmall ? (
                  <img
                    src={envState.baseUrl + userInfo?.avatarImageSmall}
                    className={"h-10 w-10 rounded-full"}
                  />
                ) : (
                  <svg
                    className={"h-10 w-10"}
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

                <div className={"font-semibold"}>{userInfo?.username}</div>
                <div></div>
                <div></div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
