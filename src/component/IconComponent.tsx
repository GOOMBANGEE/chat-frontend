import { useEnvStore } from "../store/EnvStore.tsx";

interface Props {
  onClick?: (e: React.MouseEvent) => void;
  icon: string | undefined | null;
  size: number;
}

export default function IconComponent(props: Readonly<Props>) {
  const { envState } = useEnvStore();

  const size: { [key: string]: string } = {
    8: "h-8 w-8",
    10: "h-10 w-10",
    12: "h-12 w-12",
    14: "h-14 w-14",
  };

  return (
    <>
      {props.icon ? (
        <img
          onClick={props.onClick}
          className={`${size[props.size]} rounded-full ${props.onClick ? "cursor-pointer" : "cursor-auto"}`}
          src={envState.baseUrl + props.icon}
          loading={"lazy"}
        />
      ) : (
        <div
          onClick={props.onClick}
          className={`flex ${size[props.size]} items-center justify-center rounded-full bg-customDark_5 ${props.onClick ? "cursor-pointer" : "cursor-auto"}`}
        >
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                className={"stroke-customGray_4"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </div>
      )}
    </>
  );
}
