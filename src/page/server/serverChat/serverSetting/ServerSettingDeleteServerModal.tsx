import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import useServerDelete from "../../../../hook/server/useServerDelete.tsx";
import useRefreshAccessToken from "../../../../hook/useRefreshAccessToken.tsx";

export default function ServerSettingDeleteServerModal() {
  const { serverDelete } = useServerDelete();
  const { refreshAccessToken } = useRefreshAccessToken();

  const { serverState, setServerState } = useServerStore();
  const navigate = useNavigate();

  const handleClickCancelButton = () => {
    setServerState({ settingServerDeleteModal: false });
  };

  const handleClickDeleteButton = async () => {
    if (serverState.name !== serverState.checkServerName) {
      setServerState({ serverNameVerified: false });
      return;
    }

    const refreshToken = await serverDelete();
    refreshAccessToken(refreshToken);
    if (refreshToken) {
      navigate("/server", { replace: true });
    }
  };

  // modal 바깥쪽 클릭시 modal close
  const handleClickOutside = (e: MouseEvent) => {
    if (
      serverState.settingServerDeleteModal &&
      !(e.target as HTMLElement).closest(".server-setting-delete-server-modal")
    ) {
      handleClickCancelButton();
    }
  };
  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [serverState, setServerState]);

  useEffect(() => {
    setServerState({ checkServerName: undefined, serverNameVerified: true });
  }, []);

  return (
    <div
      className={
        "fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 z-10 bg-gray-700 opacity-50"}></div>
      <div
        className={
          "server-setting-delete-server-modal z-20 flex items-center justify-center"
        }
      >
        <div
          style={{ width: "450px" }}
          className={
            "absolute mx-4 flex flex-col rounded bg-customDark_3 text-center text-customText"
          }
        >
          <div className={"px-4 py-4 text-start text-xl font-semibold"}>
            {serverState.name} 삭제
          </div>
          <div className={"mb-8 px-4 text-start"}>
            정말로 {serverState.name}서버를 삭제하시겠어요? 삭제된 서버는 복구할
            수 없어요.
          </div>

          <div className={"mb-6 flex w-full flex-col px-4"}>
            <div
              className={"mb-2 text-start text-sm font-semibold text-gray-500"}
            >
              서버 이름을 입력하세요
            </div>
            <input
              type={"text"}
              onChange={(e) => {
                setServerState({
                  checkServerName: e.target.value,
                  serverNameVerified: true,
                });
              }}
              className={"bg-customDark_1 px-2 py-1 outline-none"}
            />
            {serverState.serverNameVerified ? null : (
              <div className={"mt-1 text-start text-sm text-red-400"}>
                서버이름이 일치하지 않습니다
              </div>
            )}
          </div>

          <div
            className={
              "flex w-full items-center justify-end gap-4 rounded-b bg-customDark_1 px-4 py-4"
            }
          >
            <button
              onClick={() => handleClickCancelButton()}
              className={"px-4 py-2 text-white hover:underline"}
            >
              취소
            </button>
            <button
              onClick={() => handleClickDeleteButton()}
              className={
                "rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              }
            >
              서버 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
