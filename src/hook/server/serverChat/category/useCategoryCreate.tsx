import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { useEnvStore } from "../../../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import devLog from "../../../../devLog.ts";
import { toast } from "react-toastify";

export default function useCategoryCreate() {
  const { serverState } = useServerStore();
  const { categoryState, setCategoryState } = useCategoryStore();
  const { envState } = useEnvStore();
  const componentName = "useChannelCreate";

  const categoryCreate = async () => {
    const categoryUrl = envState.categoryUrl;
    try {
      await axios.post(`${categoryUrl}/${serverState.id}/create`, {
        name: categoryState.createModalName,
        // allowRoleIdList: ,
        // allowUserIdList: ,
      });
      devLog(componentName, "setCategoryState createModal false");
      setCategoryState({
        createModalOpen: false,
        createModalName: undefined,
        createModalOptionOpen: false,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return { categoryCreate };
}
