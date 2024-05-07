import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ChangeableTheme = {
    theme: 'bumblebee' | 'halloween';
    toggle: () => void;
}
export const useChangeableTheme = create(persist<ChangeableTheme>(
    (set, get) => ({
        theme: 'halloween',
        toggle: () => set({ theme: get().theme === 'bumblebee' ? 'halloween' : 'bumblebee' }),
    }), {
        name: 'theme',
        storage: createJSONStorage(() => localStorage),
    }
));
