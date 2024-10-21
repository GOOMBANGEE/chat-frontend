import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import useChannelCreate from "../../../../hook/server/serverChat/channel/useChannelCreate.tsx";

export default function ChannelCreateModal() {
  const { channelCreate } = useChannelCreate();
  const { serverState } = useServerStore();
  const { categoryState, setCategoryState } = useCategoryStore();
  const { channelState, setChannelState } = useChannelStore();
  const navigate = useNavigate();

  const handleClickCloseButton = () => {
    setCategoryState({
      id: undefined,
      name: undefined,
      isHover: false,
      hoverCategoryId: undefined,
      hoverButtonY: undefined,
    });
    setChannelState({ createModalOpen: false });
  };

  // modal 바깥쪽 클릭시 modal close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        channelState.createModalOpen &&
        !(e.target as HTMLElement).closest(".channel-create-modal")
      ) {
        handleClickCloseButton();
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [channelState, setChannelState]);

  const handleCreateButtonClick = async () => {
    const channelId = await channelCreate({
      serverId: serverState.id,
      userId: undefined,
    });
    if (channelId) navigate(`/server/${serverState.id}/${channelId}`);
  };

  const handleCheckboxChange = () => {
    setChannelState({
      createModalOptionOpen: !channelState.createModalOptionOpen,
    });
  };

  const isButtonDisabled = !channelState.createModalName;
  const buttonText = channelState.createModalOptionOpen ? "만들기" : "다음";

  return (
    <div
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-gray-700 opacity-50"}></div>
      <div className={"channel-create-modal flex items-center justify-center"}>
        <div
          className={
            "absolute mx-4 flex w-96 flex-col rounded bg-customDark_3 text-center text-customText"
          }
        >
          <button
            className={"absolute right-4 top-4 z-10 ml-auto"}
            onClick={handleClickCloseButton}
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
              "relative flex items-center px-4 pt-4 text-lg font-semibold"
            }
          >
            채널 만들기
          </div>
          {categoryState.id ? (
            <div className={"px-4 text-start text-xs"}>
              {categoryState.name}에 속해 있음
            </div>
          ) : null}

          <div className={"flex flex-col px-4 py-2 text-start text-gray-400"}>
            <div className={"mb-2 mt-4 text-xs font-semibold"}>채널 이름</div>
            <input
              onChange={(e) => {
                setChannelState({ createModalName: e.target.value });
              }}
              placeholder={"새로운 채널"}
              className={
                "w-full rounded bg-customDark_1 px-2 py-2 text-white outline-none"
              }
            />

            <div
              className={
                "mb-2 mt-6 flex w-full items-center text-lg text-customText"
              }
            >
              <svg
                className={"mr-1"}
                width="20px"
                height="20px"
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
                    d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
              비공개 채널
              <div className={"ml-auto flex"}>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none"
                    onChange={handleCheckboxChange}
                  />
                  <div className="peer relative h-6 w-11 rounded-full bg-customGray_3 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full"></div>
                </label>
              </div>
            </div>
            <div className={"text-sm"}>
              선택한 멤버들과 역할만 이 채널을 볼 수 있어요.
            </div>

            <button
              onClick={handleCreateButtonClick}
              disabled={isButtonDisabled}
              className={`ml-auto mt-4 w-24 rounded py-2 text-sm text-customText ${
                isButtonDisabled
                  ? "bg-indigo-500 opacity-50"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
