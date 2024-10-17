import { useEnvStore } from "../store/EnvStore.tsx";
import { ImageInfo } from "../../index";

interface Props {
  image: ImageInfo;
  maxWidth: string | undefined;
}

export default function ImageAttachment(props: Readonly<Props>) {
  const { envState } = useEnvStore();

  return (
    <>
      {props.image.link ? (
        <div
          style={{
            maxWidth: props.maxWidth ? props.maxWidth : "",
            width: props.image.width,
          }}
          className={`${props.image.width ? "bg-customDark_2" : ""} rounded`}
        >
          <img className="rounded" src={envState.baseUrl + props.image.link} />
        </div>
      ) : null}
    </>
  );
}
