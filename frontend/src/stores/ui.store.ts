import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;

  // Modal
  isModalOpen: boolean;
  modalType: string | null;
  modalData: any;

  // Toast
  toasts: Toast[];

  // Loading
  globalLoading: boolean;

  // Theme
  theme: "light" | "dark";

  // Language
  language: string;
}

interface UIActions {
  // Sidebar
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // Modal
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;

  // Toast
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Loading
  setGlobalLoading: (loading: boolean) => void;

  // Theme
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Language
  setLanguage: (language: string) => void;
}

type Toast = {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
};

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // State
      isSidebarOpen: false,
      isModalOpen: false,
      modalType: null,
      modalData: null,
      toasts: [],
      globalLoading: false,
      theme: "light",
      language: "en",

      // Sidebar Actions
      toggleSidebar: () => {
        set({ isSidebarOpen: !get().isSidebarOpen });
      },

      openSidebar: () => {
        set({ isSidebarOpen: true });
      },

      closeSidebar: () => {
        set({ isSidebarOpen: false });
      },

      // Modal Actions
      openModal: (type: string, data?: any) => {
        set({
          isModalOpen: true,
          modalType: type,
          modalData: data,
        });
      },

      closeModal: () => {
        set({
          isModalOpen: false,
          modalType: null,
          modalData: null,
        });
      },

      // Toast Actions
      addToast: (toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
          id,
          duration: 5000,
          ...toast,
        };

        set({ toasts: [...get().toasts, newToast] });

        // Auto remove toast after duration
        if (newToast.duration) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }
      },

      removeToast: (id: string) => {
        set({
          toasts: get().toasts.filter((toast) => toast.id !== id),
        });
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      // Loading Actions
      setGlobalLoading: (loading: boolean) => {
        set({ globalLoading: loading });
      },

      // Theme Actions
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        set({ theme: newTheme });
      },

      setTheme: (theme: "light" | "dark") => {
        set({ theme });
      },

      // Language Actions
      setLanguage: (language: string) => {
        set({ language });
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
