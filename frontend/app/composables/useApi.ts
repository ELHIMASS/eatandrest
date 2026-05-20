import type { components } from '~/types/openapi'

export type Restaurant = components['schemas']['Restaurant']
export type SlotResponse = components['schemas']['SlotResponse']
export type CreateReservation = components['schemas']['CreateReservation']
export type ReservationResponse = components['schemas']['ReservationResponse']
export type ApiError = components['schemas']['ApiError']
export type CancelResponse = components['schemas']['CancelResponse']

export const useApi = () => {
  const config = useRuntimeConfig()
  // Since we are running locally in development, our backend API is on http://localhost:3000
  const BASE_URL = 'http://localhost:3000'

  const fetchApi = async <T>(endpoint: string, options?: Parameters<typeof $fetch>[1]): Promise<T> => {
    try {
      return await $fetch<T>(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        }
      })
    } catch (error: any) {
      // Return structured backend API error if available
      if (error.data) {
        throw error.data as ApiError
      }
      throw {
        statusCode: error.status || 500,
        message: error.message || 'Une erreur inconnue est survenue.'
      } as ApiError
    }
  }

  return {
    getRestaurants: () => fetchApi<Restaurant[]>('/restaurants'),
    getRestaurant: (id: string) => fetchApi<Restaurant>(`/restaurants/${id}`),
    getSlots: (restaurantId: string, date: string) => 
      fetchApi<SlotResponse[]>(`/restaurants/${restaurantId}/slots?date=${date}`),
    createReservation: (body: CreateReservation) => 
      fetchApi<ReservationResponse>('/reservations', {
        method: 'POST',
        body
      }),
    getReservationByToken: (token: string) => 
      fetchApi<ReservationResponse>(`/reservations/by-token/${token}`),
    cancelReservation: (id: string, token: string) => 
      fetchApi<CancelResponse>(`/reservations/${id}/cancel`, {
        method: 'PATCH',
        body: { token }
      })
  }
}
