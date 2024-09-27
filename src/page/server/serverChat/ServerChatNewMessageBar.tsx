import useReadMessage from "../../../hook/server/serverChat/useReadMessage.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";

export default function ServerChatNewMessageBar() {
  const { readMessage } = useReadMessage();

  const { channelState } = useChannelStore();

  const handleClickRead = () => {
    if (channelState.lastMessageId) {
      readMessage({ chatId: channelState.lastMessageId });
    }
  };

  return (
    <div className={"absolute w-full px-2 text-customText"}>
      <div className={"mx-4 flex rounded-b bg-indigo-500 px-2 py-1"}>
        <button className={"flex-grow text-start"}>
          읽지 않은 메시지가 있어요
        </button>
        <button onClick={handleClickRead} className={"font-semibold"}>
          읽음으로 표시하기
        </button>
      </div>
    </div>
  );
}
