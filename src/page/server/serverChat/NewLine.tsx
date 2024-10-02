import { ForwardedRef, forwardRef } from "react";

export default forwardRef(function NewLine(
  _props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={"relative flex items-center"}>
      <div className={"h-0 w-full border-t border-red-500"}></div>
      <svg
        className={"absolute right-6"}
        width="28px"
        height="28px"
        viewBox="1 0 24 24"
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
            className={"fill-red-500"}
            d="M14.9999 16.0686V7.9313C14.9999 7.32548 14.9999 7.02257 14.8801 6.88231C14.7762 6.76061 14.6203 6.69602 14.4607 6.70858C14.2768 6.72305 14.0626 6.93724 13.6342 7.36561L9.56561 11.4342C9.3676 11.6322 9.2686 11.7313 9.2315 11.8454C9.19887 11.9458 9.19887 12.054 9.2315 12.1544C9.2686 12.2686 9.3676 12.3676 9.56561 12.5656L13.6342 16.6342C14.0626 17.0626 14.2768 17.2768 14.4607 17.2913C14.6203 17.3038 14.7762 17.2392 14.8801 17.1175C14.9999 16.9773 14.9999 16.6744 14.9999 16.0686Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
      <span className={"rounded bg-red-500 px-1 text-xs font-semibold"}>
        NEW
      </span>
    </div>
  );
});
