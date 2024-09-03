import { useServerStore } from "../../../../store/ServerStore.tsx";

export default function ServerSettingSidebar() {
  const { serverState, setServerState } = useServerStore();

  return (
    <div className={"flex h-full w-96 flex-col bg-customDark_1 text-gray-400"}>
      <div
        className={"ml-auto flex w-40 flex-col gap-0.5 py-10 pr-2 text-start"}
      >
        <div className={"px-2 text-xs font-semibold text-gray-500"}>
          {serverState.name}
        </div>
        <div className={"my-1 border border-gray-700"}></div>
        <button
          onClick={() => {
            setServerState({
              settingDefault: true,
              settingRole: false,
              settingUser: false,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDark_3 hover:text-gray-300 ${serverState.settingDefault ? "bg-customDark_5 text-white" : ""}`}
        >
          일반
        </button>
        <button
          onClick={() => {
            setServerState({
              settingRole: true,
              settingDefault: false,
              settingUser: false,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDark_3 hover:text-gray-300 ${serverState.settingRole ? "bg-customDark_5 text-white" : ""}`}
        >
          역할
        </button>
        <button
          onClick={() => {
            setServerState({
              settingUser: true,
              settingDefault: false,
              settingRole: false,
            });
          }}
          className={`rounded px-2 py-1 text-start hover:bg-customDark_3 hover:text-gray-300 ${serverState.settingUser ? "bg-customDark_5 text-white" : ""}`}
        >
          멤버
        </button>

        <div className={"my-1 border border-gray-700"}></div>
        <button
          onClick={() => {
            setServerState({
              settingServerDeleteModal: true,
            });
          }}
          className={
            "rounded px-2 py-1 text-start text-red-500 hover:bg-red-600 hover:text-customText"
          }
        >
          서버 삭제
        </button>
      </div>
    </div>
  );
}
