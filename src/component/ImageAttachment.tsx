import { useEnvStore } from "../store/EnvStore.tsx";
import { ImageInfo } from "../../index";
import { useEffect, useState } from "react";

interface Props {
  image: ImageInfo;
  maxWidth: string | undefined;
  maxHeight: string | undefined;
}

export default function ImageAttachment(props: Readonly<Props>) {
  const { envState } = useEnvStore();

  const [isOpen, setIsOpen] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>();

  const handleClick = () => {
    if (props.image.width && props.image.height) {
      const originalImage = props.image.link?.split("&width=")[0];
      const extension = props.image.link?.split(".")[1];
      setOriginalImage(envState.baseUrl + originalImage + "." + extension);
    }
    setIsOpen(true);
  };

  const handleClickViewOriginal = () => {
    if (props.image.width && props.image.height) {
      window.open(originalImage);
    } else {
      window.open(envState.baseUrl + props.image.link);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        !(e.target as HTMLElement).closest(".image-attachment-modal")
      ) {
        setIsOpen(false);
      }
    };
    addEventListener("mousedown", handleClickOutside);
    return () => {
      removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      {props.image.link ? (
        <button
          onClick={handleClick}
          style={{
            maxWidth: `${props.maxWidth ? props.maxWidth : "100%"}`,
            maxHeight: `${props.maxHeight ? props.maxHeight : "450px"}`,
          }}
          className={"relative h-full w-full rounded"}
        >
          <div
            style={{
              maxWidth: `${props.maxWidth ? props.maxWidth : "100%"}`,
              maxHeight: `${props.maxHeight ? props.maxHeight : "450px"}`,
              zIndex: "-10",
            }}
            className={"absolute h-full w-full bg-customDark_2"}
          />
          <img
            style={{
              maxWidth: `${props.maxWidth ? props.maxWidth : "100%"}`,
              maxHeight: `${props.maxHeight ? props.maxHeight : "450px"}`,
            }}
            className={"h-full rounded"}
            src={envState.baseUrl + props.image.link}
            loading={"lazy"}
          />
        </button>
      ) : null}
      {isOpen ? (
        <div className={"fixed inset-0 z-50 flex items-center justify-center"}>
          <div className={`fixed inset-0 bg-customDark_5 opacity-70`}></div>

          <div
            style={{
              maxWidth: "80vw",
              maxHeight: "40vw",
            }}
            className={
              "image-attachment-modal absolute z-50 items-center justify-center"
            }
          >
            <img
              style={{
                maxWidth: "80vw",
                maxHeight: "40vw",
              }}
              src={envState.baseUrl + props.image.link}
              className={"rounded"}
            />
            <button
              onClick={handleClickViewOriginal}
              className={"text-gray-400 hover:text-customText hover:underline"}
            >
              원본 보기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
