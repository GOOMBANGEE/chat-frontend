import { useChatStore } from "../../../store/ChatStore.tsx";
import IconComponent from "../../../component/IconComponent.tsx";
import ImageAttachment from "../../../component/ImageAttachment.tsx";
import { ImageInfo } from "../../../../index";
import PaginationBar from "./PaginationBar.tsx";

export default function ServerChatSearchList() {
  const { chatSearchListState } = useChatStore();

  return (
    <div
      style={{
        maxWidth: "500px",
        maxHeight: "calc(100vh - 70px)",
        width: "30vw",
      }}
      className={
        "custom-scrollbar flex h-full flex-col gap-y-2 overflow-x-hidden overflow-y-scroll rounded bg-customDark_1 px-2 py-2 text-customText"
      }
    >
      <div className={"text-xs text-gray-400"}>결과</div>
      <div className={"border-2 border-customDark_6"}></div>
      {chatSearchListState.chatList?.map((chat) => {
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

        const imageInfo: ImageInfo = {
          link: chat.attachment,
          width: chat.attachmentWidth,
          height: chat.attachmentHeight,
        };

        return (
          <div
            key={chat.id}
            className={
              "flex w-full gap-x-2 rounded bg-customDark_3 px-2 py-1 text-start"
            }
          >
            <IconComponent icon={chat.avatarImageSmall} size={8} />
            <div
              style={{ maxWidth: "calc(100% - 50px)" }}
              className={"flex w-full flex-col"}
            >
              <div
                style={{ maxWidth: "calc(100% - 40px)" }}
                className={"mb-1 flex items-center gap-x-2"}
              >
                <div className={"truncate font-semibold"}>{chat.username}</div>
                {formattedTime && (
                  <div className={"truncate text-xs text-gray-400"}>
                    {formattedTime}
                  </div>
                )}
              </div>
              <ImageAttachment
                image={imageInfo}
                maxWidth={"100%"}
                maxHeight={"350px"}
              />

              <div className={"break-words"}>
                <div>{imageInfo.width}</div>

                {chat.message}
                {chat.createTime !== chat.updateTime ? (
                  <span className={"ml-1 align-baseline text-xs text-gray-400"}>
                    (수정됨)
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      {/* page */}
      <PaginationBar
        currentPage={chatSearchListState.page}
        totalPage={chatSearchListState.total}
      />
    </div>
  );
}
