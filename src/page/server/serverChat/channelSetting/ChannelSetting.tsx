import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import ChannelSettingSidebar from "./ChannelSettingSidebar.tsx";
import ChannelSettingDefault from "./ChannelSettingDefault.tsx";
import ChannelSettingAuth from "./ChannelSettingAuth.tsx";

export default function ChannelSetting() {
  const { channelState, setChannelState } = useChannelStore();

  return (
    <div
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-customDark_3"}></div>

      <div className={"z-10 flex h-full w-full"}>
        <ChannelSettingSidebar />

        {channelState.settingDefault ? <ChannelSettingDefault /> : null}
        {channelState.settingAuth ? <ChannelSettingAuth /> : null}

        <button
          className={"absolute right-20 top-10 z-10 ml-auto"}
          onClick={() => {
            setChannelState({
              settingModalOpen: false,
              settingDefault: false,
              deleteModalOpen: false,
            });
          }}
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
                className={"stroke-customGray_4"}
                d="M6 6L18 18M18 6L6 18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}
