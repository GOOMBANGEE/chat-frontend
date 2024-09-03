import { useChatStore } from "../../../store/ChatStore.tsx";

export default function ServerChatSearchList() {
  const { chatSearchListState } = useChatStore();

  return (
    <div
      className={
        "flex h-full w-96 flex-col gap-y-2 bg-customDark_1 px-4 py-6 text-customText"
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
              "flex flex-col rounded bg-customDark_3 px-2 py-1 text-start"
            }
          >
            <div className={"flex items-end"}>
              <div className={"mr-2 font-semibold"}>{chat.username}</div>
              {formattedTime && (
                <div className={"text-xs text-gray-400"}>{formattedTime}</div>
              )}
            </div>
            <div>{chat.message}</div>
          </div>
        );
      })}
    </div>
  );
}
