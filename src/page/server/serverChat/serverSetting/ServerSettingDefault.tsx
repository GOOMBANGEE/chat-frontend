import { useServerStore } from "../../../../store/ServerStore.tsx";
import useServerSetting from "../../../../hook/server/useServerSetting.tsx";
import { ChangeEvent, useRef } from "react";
import useServerSettingIcon from "../../../../hook/server/useServerSettingIcon.tsx";
import { useEnvStore } from "../../../../store/EnvStore.tsx";

export default function ServerSettingDefault() {
  const { serverSettingIcon } = useServerSettingIcon();
  const { serverSetting } = useServerSetting();
  const { serverState, setServerState } = useServerStore();
  const { envState } = useEnvStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  // 버튼클릭시 input 클릭하는 효과
  const handleClickFileInputButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      if (file.type.startsWith("image")) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const image = new Image();
          image.src = reader.result as string;

          image.onload = () => {
            setServerState({
              newServerIcon: reader.result as string,
            });
          };
        };
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClickSettingIconButton = () => {
    if (serverState.newServerIcon) {
      serverSettingIcon();
    }
  };

  const handleClickSettingButton = () => {
    if (serverState.newServerName) {
      serverSetting();
    }
  };

  return (
    <div className={"z-10 h-full w-full px-8 py-8 text-customText"}>
      <div className={"mb-4 text-lg font-bold"}>서버 개요</div>

      <div className={"mb-8 flex w-4/5 flex-col rounded py-4"}>
        <div className={"mb-6 flex items-center"}>
          {serverState.icon || serverState.newServerIcon ? (
            <img
              src={
                serverState.newServerIcon
                  ? serverState.newServerIcon
                  : envState.baseUrl + serverState.icon
              }
              className={"h-14 w-14 rounded-full"}
            />
          ) : (
            <div
              className={
                "flex h-14 w-14 items-center justify-center rounded-full bg-customDark_0 font-semibold"
              }
            >
              {serverState.name ? serverState.name[0] : null}
            </div>
          )}

          <div className={"ml-4"}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className={"hidden"}
            />
            <button
              onClick={handleClickFileInputButton}
              className={
                "rounded border-2 border-indigo-500 px-4 py-2 hover:bg-indigo-500"
              }
            >
              이미지 업로드
            </button>
          </div>

          <button
            onClick={() => handleClickSettingIconButton()}
            className={
              "ml-auto rounded bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600"
            }
          >
            저장
          </button>
        </div>

        <div className={"mb-2 text-start text-xs font-semibold text-gray-400"}>
          서버이름
        </div>

        <div className={"flex"}>
          <input
            onChange={(e) => {
              setServerState({
                newServerName: e.target.value,
              });
            }}
            defaultValue={serverState.name}
            className={
              "w-2/3 rounded bg-customDark_1 px-2 py-2 text-sm outline-none"
            }
          />
          <button
            onClick={() => handleClickSettingButton()}
            className={
              "ml-auto rounded bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600"
            }
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
}
