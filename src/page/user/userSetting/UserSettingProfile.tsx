import { useUserStore } from "../../../store/UserStore.tsx";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import useUsernameCheck from "../../../hook/user/register/useUsernameCheck.tsx";
import useResetUsername from "../../../hook/user/useResetUsername.tsx";

export default function UserSettingProfile() {
  const { resetUsername } = useResetUsername();
  const { usernameCheck } = useUsernameCheck();

  const { userState, setUserState } = useUserStore();

  const debouncedUsernameCheck = useCallback(
    debounce((username: string) => {
      usernameCheck(username);
    }, 1000),
    [],
  );

  useEffect(() => {
    return () => {
      setUserState({
        usernameVerified: true,
        usernameErrorMessage: undefined,
        newUsername: undefined,
      });
    };
  }, []);

  return (
    <div className={"z-10 h-full w-full px-8 py-8 text-white"}>
      <div className={"mb-4 text-lg font-bold"}>프로필</div>

      <div className={"mb-8 flex w-4/5 flex-col rounded py-4"}>
        <div className={"mb-6 w-full"}>
          {userState.usernameVerified ? (
            <div
              className={"mb-2 text-start text-xs font-semibold text-gray-400"}
            >
              사용자명
            </div>
          ) : (
            <div
              className={"mb-2 text-start text-xs font-semibold text-red-400"}
            >
              사용자명{" "}
              <span className={"font-light"}>
                {userState.usernameErrorMessage}
              </span>
            </div>
          )}
          <div className={"flex"}>
            <input
              onChange={(e) => {
                setUserState({
                  newUsername: e.target.value,
                  usernameVerified: true,
                  usernameErrorMessage: undefined,
                });
                debouncedUsernameCheck(e.target.value);
              }}
              defaultValue={userState.username}
              className={"bg-inputBackground w-2/3 rounded px-2 py-2 text-sm"}
            />
            <button
              onClick={() => resetUsername()}
              className={
                "ml-auto rounded bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600"
              }
            >
              수정
            </button>
          </div>
        </div>

        <div className={"flex flex-col"}>
          <div className={"mb-2 text-lg font-semibold text-gray-400"}>
            비밀번호 변경
          </div>
          <button
            onClick={() =>
              setUserState({ userSettingPasswordChangeModal: true })
            }
            className={
              "w-36 rounded bg-indigo-500 px-2 py-2 text-sm hover:bg-indigo-600"
            }
          >
            비밀번호 변경하기
          </button>
        </div>
      </div>
    </div>
  );
}
