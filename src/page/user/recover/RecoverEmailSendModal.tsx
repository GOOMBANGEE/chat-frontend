import { useUserStore } from "../../../store/UserStore.tsx";

export default function RecoverEmailSendModal() {
  const { userState, setUserState } = useUserStore();

  const handleClickButton = () => {
    setUserState({ userRecoverEmailSendModal: false });
  };

  return (
    <div
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-gray-700 opacity-50"}></div>
      <div className={"server-add-modal flex items-center justify-center"}>
        <div
          className={
            "absolute mx-4 flex w-96 flex-col rounded bg-customDark_3 text-center text-customText"
          }
        >
          <div className={"relative flex px-4 py-4 text-lg font-semibold"}>
            이메일 전송 완료
          </div>
          <div
            className={"mb-4 flex flex-col px-4 py-2 text-start text-gray-300"}
          >
            <div>계정 비밀번호 변경 방법을</div>
            <div>{userState.email}(으)로 보냈어요.</div>
            <div>받은 편지함 또는 스팸함을 확인해 주세요.</div>
          </div>

          <div
            className={
              "flex w-full flex-col rounded-b bg-customDark_1 px-4 py-4"
            }
          >
            <button
              onClick={() => {
                handleClickButton();
              }}
              className={
                "ml-auto rounded bg-indigo-500 px-8 py-2 text-sm hover:bg-indigo-600"
              }
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
