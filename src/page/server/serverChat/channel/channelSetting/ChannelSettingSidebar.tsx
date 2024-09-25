import { useChannelStore } from "../../../../../store/ChannelStore.tsx";

export default function ChannelSettingSidebar() {
  const { channelState, setChannelState } = useChannelStore();
  return (
    <div className={"flex h-full w-96 flex-col bg-customDark_1 text-gray-400"}>
      <div
        className={"ml-auto flex w-40 flex-col gap-0.5 py-10 pr-2 text-start"}
      >
        <div className={"px-2 text-xs font-semibold text-gray-500"}>
          {channelState.name}
        </div>
        <div className={"my-1 border border-gray-700"}></div>
        <button
          onClick={() => {
            setChannelState({
              settingDefault: true,
              settingAuth: false,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDark_3 hover:text-gray-300 ${channelState.settingDefault ? "bg-customDark_5 text-white" : ""}`}
        >
          일반
        </button>
        <button
          onClick={() => {
            setChannelState({
              settingDefault: false,
              settingAuth: true,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDark_3 hover:text-gray-300 ${channelState.settingAuth ? "bg-customDark_5 text-white" : ""}`}
        >
          권한
        </button>

        <div className={"my-1 border border-gray-700"}></div>
        <button
          onClick={() => {
            setChannelState({
              deleteModalOpen: true,
            });
          }}
          className={
            "rounded px-2 py-1 text-start text-red-500 hover:bg-red-600 hover:text-customText"
          }
        >
          채널 삭제
        </button>
      </div>
    </div>
  );
}
