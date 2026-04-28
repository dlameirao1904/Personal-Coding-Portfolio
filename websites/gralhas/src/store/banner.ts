import { defineStore } from 'pinia';

export const useBannerStore = defineStore('banner', {
    state: () => ({
        isVisible: true as boolean,
    }),
    getters: {
        isPwaBannerVisible(): boolean {
            return this.isVisible;
        }
    },
    actions: {
        setIsPwaBannerVisible(value: boolean) {
            this.isVisible = value;
        }
    },
    persist: true,
});