import { defineStore } from 'pinia'
import { useApi, type Restaurant, type SlotResponse } from '../composables/useApi'

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    restaurants: [] as Restaurant[],
    currentRestaurant: null as Restaurant | null,
    slots: [] as SlotResponse[],
    isLoading: false,
    pendingSlots: false,
    error: null as string | null
  }),

  actions: {
    async fetchRestaurants() {
      this.isLoading = true
      this.error = null
      try {
        const api = useApi()
        this.restaurants = await api.getRestaurants()
      } catch (err: any) {
        this.error = err.message || "Impossible de charger la liste des restaurants."
      } finally {
        this.isLoading = false
      }
    },

    async fetchRestaurant(id: string) {
      this.isLoading = true
      this.error = null
      try {
        const api = useApi()
        this.currentRestaurant = await api.getRestaurant(id)
      } catch (err: any) {
        this.error = err.message || "Impossible de charger les détails du restaurant."
      } finally {
        this.isLoading = false
      }
    },

    async fetchSlots(restaurantId: string, date: string) {
      this.pendingSlots = true
      try {
        const api = useApi()
        this.slots = await api.getSlots(restaurantId, date)
      } catch (err: any) {
        // Silent catch or simple console warning
        console.error("Slots fetch error:", err)
      } finally {
        this.pendingSlots = false
      }
    }
  }
})
