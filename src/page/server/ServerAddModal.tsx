import ServerAddModalCreate from "./ServerAddModalCreate.tsx";
import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import ServerAddModalJoin from "./ServerAddModalJoin.tsx";
import { useEffect } from "react";

export default function ServerAddModal() {
  const { serverAddState, setServerAddState, resetServerAddState } =
    useServerAddStore();

  // modal 바깥쪽 클릭시 modal close
  const handleClickOutside = (e: MouseEvent) => {
    if (
      serverAddState.open &&
      !(e.target as HTMLElement).closest(".server-add-modal")
    ) {
      resetServerAddState();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [serverAddState, setServerAddState]);

  return (
    <div
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-gray-700 opacity-50"}></div>
      <div className={"server-add-modal flex items-center justify-center"}>
        {serverAddState.join ? (
          <ServerAddModalJoin />
        ) : (
          <ServerAddModalCreate />
        )}
      </div>
    </div>
  );
}
