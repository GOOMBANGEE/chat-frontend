import { useGlobalStore } from "../store/GlobalStore.tsx";
import { matchPath } from "react-router-dom";
import devLog from "../devLog.ts";

interface Props {
  rootPath?: string;
  routePathList: string[];
}

export default function useCheckPath() {
  const { setGlobalState } = useGlobalStore();
  const componentName = "useCheckPath";

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
      devLog(componentName, "setGlobalState");
      setGlobalState({ pageInvalid: true });
    }
  };

  return { checkPath };
}
