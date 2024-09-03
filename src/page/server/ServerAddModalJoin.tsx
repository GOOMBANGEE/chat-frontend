import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import { useEnvStore } from "../../store/EnvStore.tsx";
import useServerJoin from "../../hook/server/useServerJoin.tsx";
import { useNavigate } from "react-router-dom";

export default function ServerAddModalJoin() {
  const { serverJoin } = useServerJoin();
  const { serverAddState, setServerAddState, resetServerAddState } =
    useServerAddStore();
  const { envState } = useEnvStore();
  const navigate = useNavigate();

  const handleClickJoinButton = async () => {
    // invite/{code} 를 입력했다면 {code} 부분만 추출
    if (!serverAddState.code) return;
    let code;
    if (serverAddState.code?.indexOf("invite/") !== -1) {
      code = serverAddState.code?.slice(
        serverAddState.code?.indexOf("invite/") + 7,
      );
    } else {
      code = serverAddState.code;
    }
    const serverId = await serverJoin({ code });
    navigate(`/server/${serverId}`);
  };

  return (
    <div
      className={
        "absolute mx-4 flex w-96 flex-col rounded bg-customDark_3 text-center text-customText"
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
              className={"stroke-customGray_4"}
              d="M6 6L18 18M18 6L6 18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </button>
      <div
        className={
          "relative flex items-center justify-center px-4 py-4 text-lg font-semibold"
        }
      >
        서버 참가하기
      </div>
      <div className={"flex flex-col px-4 py-2 text-start text-gray-400"}>
        <div className={"mb-4 text-center text-sm"}>
          아래에 초대 코드를 입력하여 서버에 참가하세요.
        </div>

        <div
          className={`mb-1 text-start text-xs ${serverAddState.codeVerified ? "text-gray-300" : "text-red-400"} `}
        >
          초대코드
          {!serverAddState.codeVerified ? (
            <span className={"font-light"}>
              - {serverAddState.codeErrorMessage}
            </span>
          ) : null}
        </div>
        <input
          onChange={(e) => {
            setServerAddState({
              code: e.target.value,
              codeVerified: true,
              codeErrorMessage: undefined,
            });
          }}
          placeholder={`${envState.baseUrl}/invite/example`}
          className={
            "mb-4 w-full rounded bg-customDark_1 px-2 py-2 text-customText outline-none"
          }
        />
        <div className={"mb-2 flex flex-col text-xs"}>
          <div className={"mb-1 font-semibold"}>초대는 다음 형태여야 해요.</div>
          <div>example</div>
          <div>{envState.baseUrl}/invite/example</div>
        </div>
      </div>

      <div
        className={
          "flex w-full items-center justify-center rounded-b bg-customDark_1 px-4 py-4"
        }
      >
        <button
          onClick={() =>
            setServerAddState({
              code: undefined,
              join: false,
              codeVerified: true,
              codeErrorMessage: undefined,
            })
          }
          className={"text-sm text-gray-400"}
        >
          뒤로 가기
        </button>
        {serverAddState.code ? (
          <button
            onClick={() => {
              handleClickJoinButton();
            }}
            className={
              "ml-auto rounded bg-indigo-500 px-4 py-2 text-sm text-customText hover:bg-indigo-600"
            }
          >
            서버 참가하기
          </button>
        ) : (
          <div
            className={
              "ml-auto rounded bg-indigo-500 px-4 py-2 text-sm text-customText opacity-50"
            }
          >
            서버 참가하기
          </div>
        )}
      </div>
    </div>
  );
}
