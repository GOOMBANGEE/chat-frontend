import { useServerAddStore } from "../../store/ServerAddStore.tsx";
import useServerCreate from "../../hook/server/useServerCreate.tsx";
import { useNavigate } from "react-router-dom";

export default function ServerAddModalCreate() {
  const { serverCreate } = useServerCreate();
  const { serverAddState, setServerAddState, resetServerAddState } =
    useServerAddStore();

  const navigate = useNavigate();

  const handleCreateButtonClick = async () => {
    const serverId = await serverCreate();

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
        서버를 만들어보세요
      </div>
      <div className={"flex flex-col px-4 py-2 text-start text-gray-400"}>
        <div className={"mb-2 text-center text-sm"}>
          새로운 서버에 이름과 아이콘을 부여해 개성을 드러내보세요. 나중에
          언제든 바꿀 수 있어요.
        </div>
        <button className={"mb-6 flex items-center justify-center"}>
          <svg
            width="64px"
            height="64px"
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
                d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                className={"stroke-customGray_4"}
                d="M3 16.8V9.2C3 8.0799 3 7.51984 3.21799 7.09202C3.40973 6.71569 3.71569 6.40973 4.09202 6.21799C4.51984 6 5.0799 6 6.2 6H7.25464C7.37758 6 7.43905 6 7.49576 5.9935C7.79166 5.95961 8.05705 5.79559 8.21969 5.54609C8.25086 5.49827 8.27836 5.44328 8.33333 5.33333C8.44329 5.11342 8.49827 5.00346 8.56062 4.90782C8.8859 4.40882 9.41668 4.08078 10.0085 4.01299C10.1219 4 10.2448 4 10.4907 4H13.5093C13.7552 4 13.8781 4 13.9915 4.01299C14.5833 4.08078 15.1141 4.40882 15.4394 4.90782C15.5017 5.00345 15.5567 5.11345 15.6667 5.33333C15.7216 5.44329 15.7491 5.49827 15.7803 5.54609C15.943 5.79559 16.2083 5.95961 16.5042 5.9935C16.561 6 16.6224 6 16.7454 6H17.8C18.9201 6 19.4802 6 19.908 6.21799C20.2843 6.40973 20.5903 6.71569 20.782 7.09202C21 7.51984 21 8.0799 21 9.2V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </button>

        <div className={"mb-2 text-xs font-semibold"}>서버 이름</div>
        <input
          onChange={(e) => {
            setServerAddState({ name: e.target.value });
          }}
          defaultValue={`${serverAddState.name}`}
          className={
            "w-full rounded bg-customDark_1 px-2 py-2 text-white outline-none"
          }
        />
        {serverAddState.name ? (
          <button
            onClick={() => handleCreateButtonClick()}
            className={
              "ml-auto mt-4 w-24 rounded bg-indigo-500 py-2 text-sm text-customText hover:bg-indigo-600"
            }
          >
            만들기
          </button>
        ) : (
          <div
            className={
              "ml-auto mt-4 w-24 rounded bg-indigo-500 py-2 text-center text-sm text-customText opacity-50"
            }
          >
            만들기
          </div>
        )}
      </div>

      <div
        className={"flex w-full flex-col rounded-b bg-customDark_1 px-4 py-4"}
      >
        <div className={"mb-1 text-lg font-semibold"}>
          이미 초대장을 받으셨나요?
        </div>
        <button
          onClick={() => {
            setServerAddState({ join: true });
          }}
          className={"w-full rounded bg-customDark_5 py-2 text-sm"}
        >
          서버 참가하기
        </button>
      </div>
    </div>
  );
}
