import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";

export default function ServerAddModalJoin() {
  const { setServerAddState, resetServerAddState } = useServerAddStore();
  const { envState } = useEnvStore();

  return (
    <div
      className={
        "absolute mx-4 flex w-96 flex-col rounded bg-modalGray text-center"
      }
    >
      <button
        className={"absolute right-4 top-4 z-10 ml-auto"}
        onClick={() => {
          resetServerAddState();
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
      <div
        className={
          "relative flex items-center justify-center px-4 py-4 text-lg font-semibold text-white"
        }
      >
        서버 참가하기
      </div>
      <div className={"flex flex-col px-4 py-2 text-start text-gray-400"}>
        <div className={"mb-4 text-center text-sm"}>
          아래에 초대 코드를 입력하여 서버에 참가하세요.
        </div>

        <div className={"mb-2 text-xs font-semibold"}>초대 링크</div>
        <input
          onChange={(e) => {
            setServerAddState({ name: e.target.value });
          }}
          placeholder={`${envState.baseUrl}/example`}
          className={"mb-4 w-full rounded bg-customGray px-2 py-2 text-white"}
        />
        <div className={"mb-2 flex flex-col text-xs"}>
          <div className={"mb-1 font-semibold"}>초대는 다음 형태여야 해요.</div>
          <div>example</div>
          <div>{envState.baseUrl}/example</div>
        </div>
      </div>

      <div
        style={{ backgroundColor: "#1D2125" }}
        className={
          "flex w-full items-center justify-center rounded-b px-4 py-4"
        }
      >
        <button
          onClick={() => setServerAddState({ join: false })}
          className={"text-sm text-gray-400"}
        >
          뒤로 가기
        </button>
        <button
          onClick={() => {
            setServerAddState({ join: true });
          }}
          className={
            "ml-auto rounded bg-indigo-500 px-4 py-2 text-sm text-white"
          }
        >
          서버 참가하기
        </button>
      </div>
    </div>
  );
}
