import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import useChannelRename from "../../../../hook/server/channel/useChannelRename.tsx";

export default function ChannelSettingDefault() {
  const { channelRename } = useChannelRename();
  const { channelState, setChannelState } = useChannelStore();

  const handleClickSettingButton = () => {
    if (channelState.newName) {
      channelRename();
    }
  };

  return (
    <div className={"z-10 h-full w-full px-8 py-8 text-customText"}>
      <div className={"mb-4 text-lg font-bold"}>일반</div>

      <div className={"mb-8 flex w-4/5 flex-col rounded py-4"}>
        <div className={"mb-6 w-full"}>
          <div
            className={"mb-2 text-start text-xs font-semibold text-gray-400"}
          >
            채널이름
          </div>

          <div className={"flex"}>
            <input
              onChange={(e) => {
                setChannelState({
                  newName: e.target.value,
                });
              }}
              defaultValue={channelState.name}
              className={
                "w-2/3 rounded bg-customDark_1 px-2 py-2 text-sm outline-none"
              }
            />
            <button
              onClick={() => handleClickSettingButton()}
              className={
                "ml-auto rounded bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600"
              }
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
