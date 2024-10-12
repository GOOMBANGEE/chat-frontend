import { useServerStore } from "../../../../store/ServerStore.tsx";

export default function ChatSearchOption() {
  const { setServerState } = useServerStore();

  const handleClickUserOption = () => {
    setServerState({
      searchOptionMenu: false,
      searchOption: true,
      searchOptionUser: true,
    });
  };

  const handleClickMessageOption = () => {
    setServerState({
      searchOptionMenu: false,
      searchOption: true,
      searchOptionMessage: true,
    });
  };

  return (
    <div
      className={
        "server-search-bar absolute right-10 top-12 z-10 flex w-48 flex-col justify-center rounded bg-black px-2 py-4"
      }
    >
      <div className={"mb-1 px-2 text-xs text-gray-500"}>검색옵션</div>
      <button
        onClick={() => handleClickUserOption()}
        className={
          "group w-full rounded px-2 py-1 text-start font-semibold text-gray-400 hover:bg-customDark_1 hover:text-gray-300"
        }
      >
        유저이름:{" "}
        <span className={"font-medium text-gray-400 group-hover:text-gray-300"}>
          사용자
        </span>
      </button>

      <button
        onClick={() => handleClickMessageOption()}
        className={
          "group w-full rounded px-2 py-1 text-start font-semibold text-gray-400 hover:bg-customDark_1 hover:text-gray-300"
        }
      >
        메시지:{" "}
        <span className={"font-medium text-gray-400 group-hover:text-gray-300"}>
          내용
        </span>
      </button>
    </div>
  );
}
