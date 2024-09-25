import { useEffect, useState } from "react";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";

export default function CategoryContextMenu() {
  const { categoryState, setCategoryState } = useCategoryStore();
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleClickSettingButton = () => {
    setCategoryState({
      contextMenu: false,
      settingModalOpen: true,
      settingDefault: true,
    });
  };

  const handleClickDeleteButton = () => {
    setCategoryState({
      deleteModalOpen: true,
      contextMenu: false,
    });
  };

  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryState.contextMenu &&
        !(e.target as HTMLElement).closest(".category-context-menu")
      ) {
        setCategoryState({
          id: undefined,
          name: undefined,
          contextMenu: false,
        });
      }
    };
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mouseup", handleClickOutside);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [categoryState, setCategoryState]);

  return (
    <div
      style={{
        top: `${Math.min(menuPosition.y, window.innerHeight - 160)}px`,
        left: `${Math.min(menuPosition.x, window.innerWidth - 150)}px`,
      }}
      className={
        "category-context-menu fixed flex flex-col gap-2 rounded bg-black px-2 py-2 text-gray-300"
      }
    >
      <button
        onClick={handleClickSettingButton}
        className={
          "rounded px-2 py-1 text-start text-sm hover:bg-indigo-500 hover:text-white"
        }
      >
        카테고리 편집
      </button>
      <button
        onClick={handleClickDeleteButton}
        className={
          "rounded px-2 py-1 text-start text-sm text-red-500 hover:bg-red-600 hover:text-white"
        }
      >
        카테고리 삭제
      </button>
    </div>
  );
}
