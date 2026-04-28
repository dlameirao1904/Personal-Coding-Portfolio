// Utilities
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => ({
        editing: false,
        _isSidebarOpen: false,
        _isMobile: false,
    }),
    getters: {
        isEditing: (state) => state.editing,
        isSidebarOpen: (state) => state._isSidebarOpen,
        isMobile: (state) => state._isMobile,
    },
    actions: {
        setEditing(value: boolean) {
            this.editing = value;
        },
        setIsSidebarOpen(value: boolean) {
            this._isSidebarOpen = value;
        },
        setIsMobile(value: boolean) {
            this._isMobile = value;
        },
    },
});
