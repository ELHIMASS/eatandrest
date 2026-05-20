import { defineStore } from 'pinia'
import { useApi, type CreateReservation, type ReservationResponse } from '../composables/useApi'

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    bookingSuccess: null as ReservationResponse | null,
    activeReservation: null as ReservationResponse | null,
    isSubmitting: false,
    isCancelling: false,
    isLoading: false,
    apiErrors: {} as Record<string, string>,
    generalError: null as string | null,
    cancellationSuccessMessage: ''
  }),

  actions: {
    resetBooking() {
      this.bookingSuccess = null
      this.activeReservation = null
      this.cancellationSuccessMessage = ''
      this.resetErrors()
    },

    resetErrors() {
      this.apiErrors = {}
      this.generalError = null
    },

    async createBooking(payload: CreateReservation) {
      this.isSubmitting = true
      this.resetErrors()
      try {
        const api = useApi()
        const res = await api.createReservation(payload)
        this.bookingSuccess = res
        return res
      } catch (error: any) {
        if (error.field) {
          this.apiErrors[error.field] = error.message
        } else {
          this.generalError = error.message || "Une erreur est survenue lors de la soumission de la réservation."
        }
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    async fetchReservation(token: string) {
      if (!token.trim()) return
      this.isLoading = true
      this.resetErrors()
      this.cancellationSuccessMessage = ''
      try {
        const api = useApi()
        const res = await api.getReservationByToken(token.trim())
        this.activeReservation = res
        return res
      } catch (error: any) {
        this.activeReservation = null
        this.generalError = error.message || "Aucune réservation trouvée pour ce code de suivi."
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async cancelBooking(id: string, token: string) {
      this.isCancelling = true
      this.resetErrors()
      try {
        const api = useApi()
        const res = await api.cancelReservation(id, token)
        this.cancellationSuccessMessage = res.message || "Votre réservation a été annulée avec succès."
        this.activeReservation = null
        return res
      } catch (error: any) {
        this.generalError = error.message || "Impossible d'annuler la réservation."
        throw error
      } finally {
        this.isCancelling = false
      }
    }
  }
})
