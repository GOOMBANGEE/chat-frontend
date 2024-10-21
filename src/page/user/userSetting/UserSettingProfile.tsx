import { useUserStore } from "../../../store/UserStore.tsx";
import { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";
import useUsernameCheck from "../../../hook/user/register/useUsernameCheck.tsx";
import useChangeUsername from "../../../hook/user/userSetting/useChangeUsername.tsx";

export default function UserSettingProfile() {
  const { changeUsername } = useChangeUsername();
  const { usernameCheck } = useUsernameCheck();

  const { userState, setUserState } = useUserStore();

  // 버튼클릭시 input 클릭하는 효과
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedUsernameCheck = useCallback(
    debounce((username: string) => {
      usernameCheck(username);
    }, 1000),
    [],
  );

  // 버튼클릭시 input 클릭하는 효과
  const handleClickFileInputButton = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setUserState({
          userSettingAvatarChangeModal: true,
          newAvatarImage: reader.result as string,
        });
      };

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

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
    <div className={"z-10 h-full w-full px-8 py-8 text-customText"}>
      <div className={"mb-4 text-lg font-bold"}>프로필</div>

      <div className={"mb-8 flex w-4/5 flex-col gap-y-8 rounded py-4"}>
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
              className={
                "w-2/3 rounded bg-customDark_1 px-2 py-2 text-sm outline-none"
              }
            />
            <button
              onClick={() => changeUsername()}
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
            아바타
          </div>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            className={"hidden"}
          />
          <button
            onClick={handleClickFileInputButton}
            className={
              "w-36 rounded bg-indigo-500 px-2 py-2 text-sm hover:bg-indigo-600"
            }
          >
            아바타 변경하기
          </button>
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
