import axios from "axios";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useEnvStore } from "../../../../store/EnvStore.tsx";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";

export default function useCategoryDelete() {
  const { serverState } = useServerStore();
  const { categoryState } = useCategoryStore();
  const { envState } = useEnvStore();

  const categoryDelete = async () => {
    const categoryUrl = envState.categoryUrl;

    await axios.post(
      `${categoryUrl}/${serverState.id}/${categoryState.id}/delete`,
    );
  };

  return { categoryDelete };
}
