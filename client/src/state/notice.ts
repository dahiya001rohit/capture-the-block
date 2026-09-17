import { create } from 'zustand';

interface NoticeState {
    notice: boolean;
    setNotice: (notice: boolean) => void;
}

export const useNotice = create<NoticeState>((set) => ({
    notice: true,
    setNotice: (notice: boolean) => set({ notice: notice }),
}));
