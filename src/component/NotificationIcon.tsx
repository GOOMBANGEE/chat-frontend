import { useUserStore } from "../store/UserStore.tsx";
import { useEffect, useState } from "react";
import { NotificationInfo } from "../../index";
import { useEnvStore } from "../store/EnvStore.tsx";
import AvatarIcon from "./AvatarIcon.tsx";

export default function NotificationIcon() {
  const { userNotificationListState } = useUserStore();
  const { envState } = useEnvStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDM, setIsDM] = useState(false);
  const [isMention, setIsMention] = useState(false);

  const [directMessageListState, setDirectMessageListState] =
    useState<NotificationInfo[]>();
  const [mentionListState, setMentionListState] =
    useState<NotificationInfo[]>();

  const handleClickNotificationOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsDM(false);
      setIsMention(false);
    } else {
      setIsOpen(true);
      setIsDM(true);
    }
  };
  const handleClickDM = () => {
    setIsDM(true);
    setIsMention(false);
  };
  const handleClickMention = () => {
    setIsMention(true);
    setIsDM(false);
  };

  useEffect(() => {
    const directMessageList: NotificationInfo[] =
      userNotificationListState.notificationDirectMessageInfoDtoList;
    setDirectMessageListState(directMessageList);

    const mentionList: NotificationInfo[] =
      userNotificationListState.notificationServerInfoDtoList;
    setMentionListState(mentionList);
  }, [userNotificationListState]);

  useEffect(() => {
    // modal 바깥쪽 클릭시 modal close
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as HTMLElement).closest(".notification-modal")) {
        setIsOpen(false);
        setIsDM(false);
        setIsMention(false);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={"notification-modal relative flex items-center rounded"}>
      <button onClick={handleClickNotificationOpen} className={"group"}>
        <svg
          width="28px"
          height="28px"
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
              className={"stroke-customGray_4 group-hover:stroke-white"}
              d="M4 14H6.67452C7.1637 14 7.40829 14 7.63846 14.0553C7.84254 14.1043 8.03763 14.1851 8.21657 14.2947C8.4184 14.4184 8.59136 14.5914 8.93726 14.9373L9.06274 15.0627C9.40865 15.4086 9.5816 15.5816 9.78343 15.7053C9.96237 15.8149 10.1575 15.8957 10.3615 15.9447C10.5917 16 10.8363 16 11.3255 16H12.6745C13.1637 16 13.4083 16 13.6385 15.9447C13.8425 15.8957 14.0376 15.8149 14.2166 15.7053C14.4184 15.5816 14.5914 15.4086 14.9373 15.0627L15.0627 14.9373C15.4086 14.5914 15.5816 14.4184 15.7834 14.2947C15.9624 14.1851 16.1575 14.1043 16.3615 14.0553C16.5917 14 16.8363 14 17.3255 14H20M7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.07989 20 7.2V16.8C20 17.9201 20 18.4802 19.782 18.908C19.5903 19.2843 19.2843 19.5903 18.908 19.782C18.4802 20 17.9201 20 16.8 20H7.2C6.0799 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4 18.4802 4 17.9201 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.0799 4 7.2 4Z"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </button>
      {isOpen ? (
        <div
          style={{
            maxHeight: "calc(100vh - 200px)",
            left: "-350px",
          }}
          className={
            "custom-scrollbar absolute top-10 z-10 flex w-96 flex-col gap-y-4 overflow-y-auto rounded border-2 border-customDark_4 bg-customDark_0 py-4 text-customText"
          }
        >
          <div className={"flex"}>
            <button
              onClick={handleClickDM}
              className={`px-6 pb-4 pt-2 text-lg ${isDM ? "border-b-4 border-indigo-500" : "border-b-4 border-customDark_3 text-gray-400 hover:border-indigo-600 hover:text-customText"}`}
            >
              DM
            </button>
            <button
              onClick={handleClickMention}
              className={`px-6 pb-4 pt-2 text-lg ${isMention ? "border-b-4 border-indigo-500" : "border-b-4 border-customDark_3 text-gray-400 hover:border-indigo-600 hover:text-customText"}`}
            >
              멘션
            </button>
          </div>
          {isDM ? (
            <>
              {directMessageListState?.map((notification: NotificationInfo) => {
                // 시간 편집
                const createTimeToString =
                  notification.chatCreateTime?.toLocaleString();
                const year = createTimeToString?.slice(0, 4);
                const month = createTimeToString?.slice(5, 7);
                const day = createTimeToString?.slice(8, 10);
                const hour = Number(createTimeToString?.slice(11, 13));
                const minute = createTimeToString?.slice(14, 16);

                return (
                  <div key={notification.chatId} className={"flex flex-col"}>
                    <div>{notification.channelName}</div>
                    <div
                      className={
                        "mx-4 flex gap-x-4 rounded bg-customDark_4 px-2 py-2"
                      }
                    >
                      <AvatarIcon
                        avatar={notification.avatarImageSmall}
                        size={12}
                      />

                      <div className={"flex flex-col"}>
                        <div className={"mb-2 flex items-center font-semibold"}>
                          {notification.username}
                          <div className="ml-2 text-xs text-gray-400">
                            {year}.{month}.{day}. {hour > 12 ? "오후" : "오전"}{" "}
                            {hour > 12 ? hour - 12 : hour}:{minute}
                            {notification.chatCreateTime !==
                            notification.chatUpdateTime ? (
                              <span
                                className={
                                  "ml-1 align-baseline text-xs text-gray-400"
                                }
                              >
                                (수정됨)
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div>{notification.chatMessage}</div>
                        {notification.chatAttachment ? (
                          <img
                            src={envState.baseUrl + notification.chatAttachment}
                            className={"rounded"}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}

          {isMention ? (
            <>
              {mentionListState?.map((notification: NotificationInfo) => {
                return (
                  <div key={notification.chatId} className={"flex flex-col"}>
                    <div>{notification.channelName}</div>
                    <div>{notification.serverName}</div>
                    <div>{notification.avatarImageSmall}</div>
                    <div>{notification.username}</div>
                    <div>{notification.chatMessage}</div>
                  </div>
                );
              })}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
