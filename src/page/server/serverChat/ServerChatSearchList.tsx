import { useChatStore } from "../../../store/ChatStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import AvatarIcon from "../../../component/AvatarIcon.tsx";

export default function ServerChatSearchList() {
  const { chatSearchListState } = useChatStore();
  const { envState } = useEnvStore();

  return (
    <div
      style={{
        maxHeight: "calc(100vh - 70px)",
      }}
      className={
        "custom-scrollbar flex h-full w-96 flex-col gap-y-2 overflow-x-hidden overflow-y-scroll rounded bg-customDark_1 px-2 py-2 text-customText"
      }
    >
      <div className={"text-xs text-gray-400"}>결과</div>
      <div className={"border-2 border-customDark_6"}></div>
      {chatSearchListState.map((chat) => {
        // 채팅 시간 변환
        let formattedTime = "";
        if (chat.createTime) {
          const createTimeToString = chat.createTime.toLocaleString();
          const year = createTimeToString.slice(0, 4);
          const month = createTimeToString.slice(5, 7);
          const day = createTimeToString.slice(8, 10);
          let hour = Number(createTimeToString.slice(11, 13));
          const minute = createTimeToString.slice(14, 16);
          const period = hour < 12 ? "오전" : "오후";

          if (hour > 12) hour -= 12; // 12시간제로 변환

          formattedTime = `${year}.${month}.${day}. ${period} ${hour}:${minute}`;
        }

        return (
          <div
            key={chat.id}
            className={
              "flex gap-x-2 rounded bg-customDark_3 px-2 py-1 text-start"
            }
          >
            <AvatarIcon avatar={chat.avatarImageSmall} size={8} />
            <div className={"flex w-full flex-col"}>
              <div className={"mb-1 flex items-center gap-x-2"}>
                <div className={"font-semibold"}>{chat.username}</div>
                {formattedTime && (
                  <div className={"text-xs text-gray-400"}>{formattedTime}</div>
                )}
              </div>
              {chat.attachment ? (
                <div
                  style={{
                    maxWidth: "calc(100% - 50px)",
                    width: chat.attachmentWidth,
                    // height: chat.attachmentHeight,
                  }}
                  className="rounded bg-customDark_2"
                >
                  <img
                    className="rounded"
                    src={envState.baseUrl + chat.attachment}
                  />
                </div>
              ) : null}

              <div>{chat.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
