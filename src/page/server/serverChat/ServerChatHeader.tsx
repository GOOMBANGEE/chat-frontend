import { useServerStore } from "../../../store/ServerStore.tsx";

export default function ServerChatHeader() {
  const { serverState } = useServerStore();

  return (
    <div className={"w-full px-6 py-3 font-semibold shadow-md"}>
      <div>{serverState.name}</div>
      {/*todo*/}
      {/* server member button */}
    </div>
  );
}
