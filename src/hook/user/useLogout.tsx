import { deleteCookie } from "../../Cookie.tsx";

export default function useLogout() {
  const logout = () => {
    deleteCookie("refreshToken");
  };

  return { logout };
}
