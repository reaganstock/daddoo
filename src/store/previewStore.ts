import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PreviewState {
  hasAccess: boolean;
  checkCode: (code: string) => boolean;
  clearAccess: () => void;
}

export const usePreviewStore = create<PreviewState>()(
  persist(
    (set) => ({
      hasAccess: false,
      checkCode: (code: string) => {
        const isValid = code.toUpperCase() === 'DADDOO';
        if (isValid) {
          set({ hasAccess: true });
        }
        return isValid;
      },
      clearAccess: () => set({ hasAccess: false }),
    }),
    {
      name: 'preview-storage',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    }
  )
);
