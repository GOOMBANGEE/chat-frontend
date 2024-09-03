import { useUserStore } from "../../../store/UserStore.tsx";
import useFriendRequest from "../../../hook/user/useFriendRequest.tsx";
import { FormEvent, useState } from "react";

export default function ServerIndexFriendAdd() {
  const { friendRequest } = useFriendRequest();
  const { userState, setUserState } = useUserStore();

  const [sendRequest, setSendRequest] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState({ focusUsername: e.target.value });
    setSendRequest(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (await friendRequest()) {
      setSendRequest(true);
    }
  };

  return (
    <div className={"flex h-full w-full flex-col px-6 py-6 text-customText"}>
      <div className={"relative mb-4 w-full"}>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => handleKey(e)}
            placeholder={"유저이름을 사용하여 친구를 추가할 수 있어요"}
            className={`w-full rounded bg-customDark_0 px-4 py-4 outline-none ${sendRequest ? "border-2 border-green-500 focus:ring-0" : "focus:ring-1 focus:ring-indigo-400"} `}
          />
          <div className={"absolute right-3 top-2"}>
            {userState.focusUsername ? (
              <button
                type={"submit"}
                className={
                  "rounded bg-indigo-500 px-4 py-2 hover:bg-indigo-600"
                }
              >
                친구 요청 보내기
              </button>
            ) : (
              <div className={"rounded bg-indigo-500 px-4 py-2 opacity-50"}>
                친구 요청 보내기
              </div>
            )}
          </div>
        </form>
      </div>
      {sendRequest ? (
        <div className={"text-green-500"}>
          <span className={"font-semibold"}>{userState.focusUsername}</span>에게
          성공적으로 친구 요청을 보냈어요
        </div>
      ) : null}
    </div>
  );
}
