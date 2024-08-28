import { useServerStore } from "../../../../store/ServerStore.tsx";
import ServerSettingSidebar from "./ServerSettingSidebar.tsx";
import ServerSettingDeleteServerModal from "./ServerSettingDeleteServerModal.tsx";
import ServerSettingDefault from "./ServerSettingDefault.tsx";

export default function ServerSetting() {
  const { serverState, setServerState } = useServerStore();

  return (
    <div
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-defaultBackground"}></div>

      <div className={"z-10 flex h-full w-full text-white"}>
        <ServerSettingSidebar />

        {serverState.settingDefault ? <ServerSettingDefault /> : null}
        {serverState.settingServerDeleteModal ? (
          <ServerSettingDeleteServerModal />
        ) : null}

        <button
          className={"absolute right-20 top-10 z-10 ml-auto"}
          onClick={() => {
            setServerState({
              settingModalOpen: false,
              settingDefault: false,
              settingRole: false,
              settingMember: false,
              settingServerDeleteModal: false,
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
                d="M6 6L18 18M18 6L6 18"
                stroke="#9ca3af"
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
