// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
  }),
  getters: {
    getIsLoading: (state) => state.isLoading,
  },
  actions: {
    setIsLoading(isLoading: boolean) {
      this.isLoading = isLoading
    },
  },
})
