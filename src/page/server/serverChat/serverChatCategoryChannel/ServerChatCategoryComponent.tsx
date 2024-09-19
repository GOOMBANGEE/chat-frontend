import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { CategoryInfo } from "../../../../../index";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";

interface Props {
  category: CategoryInfo;
}

export default function ServerChatCategoryComponent(props: Readonly<Props>) {
  const { categoryState, setCategoryState } = useCategoryStore();
  const { setChannelState } = useChannelStore();

  const handleChannelCreateButton = () => {
    setCategoryState({
      id: props.category.id,
      isHover: false,
      hoverCategoryId: undefined,
      hoverButtonY: undefined,
    });
    setChannelState({ createModalOpen: true });
  };

  return (
    <div
      className={
        "mb-1 flex items-center text-xs font-semibold hover:text-customText"
      }
    >
      <svg
        width="12px"
        height="12px"
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
            className={"stroke-customGray_4"}
            d="M6 9L12 15L18 9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
      <div className={"ml-1"}>{props.category.name}</div>
      <button
        onClick={handleChannelCreateButton}
        onMouseOver={(e) =>
          setCategoryState({
            isHover: true,
            hoverCategoryId: props.category.id,
            hoverButtonY: e.currentTarget.getBoundingClientRect().top,
          })
        }
        onMouseLeave={() =>
          setCategoryState({
            isHover: false,
            hoverCategoryId: undefined,
            hoverButtonY: undefined,
          })
        }
        className={"ml-auto"}
      >
        <svg
          className={"mr-2"}
          width="18px"
          height="18px"
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
              className={"stroke-customGray_4"}
              d="M6 12H18M12 6V18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </button>
      {categoryState.isHover &&
      categoryState.hoverCategoryId === props.category.id ? (
        <div
          style={{
            top: `${categoryState.hoverButtonY ? categoryState.hoverButtonY - 30 : 0}px`,
            left: "144px",
          }}
          className={
            "absolute z-10 w-20 rounded bg-black px-1 py-1.5 text-center"
          }
        >
          채널 만들기
        </div>
      ) : null}
    </div>
  );
}
