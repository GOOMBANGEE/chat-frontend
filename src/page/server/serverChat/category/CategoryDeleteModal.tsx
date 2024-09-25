import { useEffect } from "react";
import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import useCategoryDelete from "../../../../hook/server/serverChat/category/useCategoryDelete.tsx";

export default function CategoryDeleteModal() {
  const { categoryDelete } = useCategoryDelete();
  const { categoryState, setCategoryState, resetCategoryState } =
    useCategoryStore();
  const handleClickCancelButton = () => {
    setCategoryState({
      deleteModalOpen: false,
    });
  };

  const handleClickDeleteButton = async () => {
    await categoryDelete();
    resetCategoryState();
  };

  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryState.deleteModalOpen &&
        !(e.target as HTMLElement).closest(".category-delete-modal")
      ) {
        handleClickCancelButton();
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [categoryState, setCategoryState]);

  return (
    <div
      className={
        "fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center"
      }
    >
      <div className={"fixed inset-0 bg-gray-700 opacity-50"}></div>
      <div
        className={
          "category-delete-modal z-10 flex items-center justify-center"
        }
      >
        <div
          style={{ width: "450px" }}
          className={
            "absolute mx-4 flex flex-col rounded bg-customDark_4 text-center text-customText"
          }
        >
          <div
            className={"px-4 py-4 text-start text-xl font-semibold text-white"}
          >
            카테고리 삭제하기
          </div>
          <div className={"mb-4 px-4 text-start"}>
            정말
            <span className={"font-semibold"}> {categoryState.name} </span>
            카테고리를 삭제할까요? 삭제하면 되돌릴 수 없어요.
          </div>

          <div
            className={
              "flex w-full items-center justify-end gap-4 rounded-b bg-customDark_1 px-4 py-4"
            }
          >
            <button
              onClick={() => handleClickCancelButton()}
              className={"px-4 py-2 hover:underline"}
            >
              취소
            </button>
            <button
              onClick={() => handleClickDeleteButton()}
              className={
                "rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              }
            >
              카테고리 삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
