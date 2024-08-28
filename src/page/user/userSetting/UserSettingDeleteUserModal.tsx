import { useEffect } from "react";
import { useUserStore } from "../../../store/UserStore.tsx";
import { useNavigate } from "react-router-dom";
import useUserDelete from "../../../hook/user/useUserDelete.tsx";

export default function UserSettingDeleteUserModal() {
  const { userDelete } = useUserDelete();
  const { userState, setUserState } = useUserStore();
  const navigate = useNavigate();

  const handleClickCancelButton = () => {
    setUserState({ userSettingDeleteUserModal: false });
  };

  const handleClickDeleteButton = async () => {
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*\d).{8,20}$/.test(
        userState.password ? userState.password : "",
      );
    if (!passwordRegExp) {
      setUserState({
        passwordVerified: false,
      });
      return;
    }

    await userDelete();
    navigate("/", { replace: true });
  };

  // modal 바깥쪽 클릭시 modal close
  const handleClickOutside = (e: MouseEvent) => {
    if (
      userState.userSettingDeleteUserModal &&
      !(e.target as HTMLElement).closest(".user-setting-delete-user-modal")
    ) {
      handleClickCancelButton();
    }
  };
  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [userState, setUserState]);

  return (
    <div
      className={
        "fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 z-10 bg-gray-700 opacity-50"}></div>
      <div
        className={
          "user-setting-delete-user-modal z-20 flex items-center justify-center"
        }
      >
        <div
          style={{ width: "450px" }}
          className={
            "absolute mx-4 flex flex-col rounded bg-modalGray text-center"
          }
        >
          <div
            className={"px-4 py-4 text-start text-xl font-semibold text-white"}
          >
            계정 삭제하기
          </div>
          <div className={"mb-8 px-4 text-start"}>
            정말로 계정을 삭제하시겠어요? 즉시 계정에서 로그아웃 되며 다시
            로그인하실 수 없어요.
          </div>

          <div className={"mb-6 flex w-full flex-col px-4"}>
            <div
              className={"mb-2 text-start text-sm font-semibold text-gray-500"}
            >
              비밀번호
            </div>
            <input
              type={"password"}
              onChange={(e) => {
                setUserState({
                  password: e.target.value,
                  passwordVerified: true,
                });
              }}
              className={"bg-customGray px-2 py-1"}
            />
            {userState.passwordVerified ? null : (
              <div className={"mt-1 text-start text-sm text-red-400"}>
                비밀번호가 일치하지 않습니다
              </div>
            )}
          </div>

          <div
            style={{ backgroundColor: "#1D2125" }}
            className={
              "flex w-full items-center justify-end gap-4 rounded-b px-4 py-4"
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
                "rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              }
            >
              계정 삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
