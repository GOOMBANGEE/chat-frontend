import { useUserStore } from "../../../store/UserStore.tsx";

export default function usePasswordCheck() {
  const { setUserState } = useUserStore();

  const passwordCheck = async (password: string) => {
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*\d).{8,20}$/.test(
        password ? password : "",
      );
    if (!passwordRegExp) {
      setUserState({
        passwordVerified: false,
        passwordErrorMessage:
          "- 비밀번호는 특수문자를 포함하여 8~20자로 설정해주세요.",
      });
      return;
    }
  };

  return { passwordCheck };
}
