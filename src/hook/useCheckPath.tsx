import { useGlobalStore } from "../store/GlobalStore.tsx";
import { matchPath } from "react-router-dom";

interface Props {
  rootPath?: string;
  routePathList: string[];
}

export default function useCheckPath() {
  const { setGlobalState } = useGlobalStore();

  const checkPath = (props: Props) => {
    let rootPath;
    if (props.rootPath) {
      rootPath = props.rootPath;
    } else {
      rootPath = "/";
    }

    if (
      !props.routePathList.some((path) =>
        matchPath(rootPath + path, location.pathname),
      )
    ) {
      setGlobalState({ pageInvalid: true });
    }
  };

  return { checkPath };
}
