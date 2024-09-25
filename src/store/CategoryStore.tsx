import { CategoryInfo, UserInfo } from "../../index";
import { create } from "zustand";

interface CategoryStore {
  categoryState: CategoryState;
  setCategoryState: (state: Partial<CategoryState>) => void;
  categoryListState: CategoryInfo[];
  setCategoryListState: (state: CategoryInfo[]) => void;
  categoryUserListState: UserInfo[];
  setCategoryUserListState: (state: UserInfo[]) => void;
  resetCategoryState: () => void;
}

interface CategoryState {
  id: number | undefined;
  name: string | undefined;
  displayOrder: number | undefined;

  // hover channel add button
  isHover: boolean;
  hoverCategoryId: number | undefined;
  hoverButtonY: number | undefined;

  // channel create modal
  createModalOpen: boolean;
  createModalName: string | undefined;
  createModalOptionOpen: boolean;

  // context menu
  contextMenu: boolean;
  deleteModalOpen: boolean;

  // channel setting
  settingModalOpen: boolean;
  settingDefault: boolean;
  settingAuth: boolean;
  newName: string | undefined;
}

const initialCategoryState: CategoryState = {
  id: undefined,
  name: undefined,
  displayOrder: undefined,

  // hover channel add button
  isHover: false,
  hoverCategoryId: undefined,
  hoverButtonY: undefined,

  // channel create modal
  createModalOpen: false,
  createModalName: undefined,
  createModalOptionOpen: true,

  // context menu
  contextMenu: false,
  deleteModalOpen: false,

  // channel setting
  settingModalOpen: false,
  settingDefault: false,
  settingAuth: false,
  newName: undefined,
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  categoryState: initialCategoryState,
  setCategoryState: (state) =>
    set((prev) => ({ categoryState: { ...prev.categoryState, ...state } })),
  categoryListState: [],
  setCategoryListState: (state) => set({ categoryListState: state }),
  categoryUserListState: [],
  setCategoryUserListState: (state) => set({ categoryUserListState: state }),
  resetCategoryState: () => set({ categoryState: initialCategoryState }),
}));
