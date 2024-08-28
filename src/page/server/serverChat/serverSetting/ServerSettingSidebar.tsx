import { useServerStore } from "../../../../store/ServerStore.tsx";

export default function ServerSettingSidebar() {
  const { serverState, setServerState } = useServerStore();

  return (
    <div
      className={"flex h-full w-96 flex-col bg-serverListSidebar text-gray-400"}
    >
      <div
        className={"ml-auto flex w-40 flex-col gap-0.5 py-10 pr-2 text-start"}
      >
        <div className={"px-2 text-xs font-semibold text-gray-500"}>
          {serverState.name}
        </div>
        <div className={"my-1 border border-customDarkGray"}></div>
        <button
          onClick={() => {
            setServerState({
              settingDefault: true,
              settingRole: false,
              settingMember: false,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDarkGray hover:text-gray-300 ${serverState.settingDefault ? "bg-customGray text-white" : ""}`}
        >
          일반
        </button>
        <button
          onClick={() => {
            setServerState({
              settingRole: true,
              settingDefault: false,
              settingMember: false,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDarkGray hover:text-gray-300 ${serverState.settingRole ? "bg-customGray text-white" : ""}`}
        >
          역할
        </button>
        <button
          onClick={() => {
            setServerState({
              settingMember: true,
              settingDefault: false,
              settingRole: false,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDarkGray hover:text-gray-300 ${serverState.settingMember ? "bg-customGray text-white" : ""}`}
        >
          멤버
        </button>

        <div className={"my-1 border border-customDarkGray"}></div>
        <button
          onClick={() => {
            setServerState({
              settingServerDeleteModal: true,
            });
          }}
          className={
            "rounded px-2 py-1 text-start hover:bg-customDarkGray hover:text-gray-300"
          }
        >
          서버 삭제
        </button>
      </div>
    </div>
  );
}
