<template>
  <div class="restaurant-details container">
    <!-- Back Navigation Link -->
    <div class="back-navigation">
      <NuxtLink to="/" class="back-link">
        <span>➔</span>
        Retour à la sélection
      </NuxtLink>
    </div>

    <!-- Main Columns Layout -->
    <div class="detail-grid" v-if="restoStore.currentRestaurant">
      
      <!-- LEFT COLUMN: Restaurant info card -->
      <section class="restaurant-info-card glass-panel animate-fade-in">
        <div class="image-header">
          <img :src="restoStore.currentRestaurant.imageUrl" :alt="restoStore.currentRestaurant.name" class="header-image" />
          <div class="cuisine-tag">{{ restoStore.currentRestaurant.cuisineType }}</div>
        </div>

        <div class="info-content">
          <h1 class="resto-name">{{ restoStore.currentRestaurant.name }}</h1>
          <div class="meta-row">
            <span class="meta-item pin">
              <span>📍</span>
              <span>{{ restoStore.currentRestaurant.address }}</span>
            </span>
          </div>

          <p class="resto-description">{{ restoStore.currentRestaurant.description }}</p>

          <div class="resto-highlights">
            <h4 class="highlights-title"> L'Expérience</h4>
            <ul class="highlights-list">
              <li>- Ingrédients frais et sélectionnés de saison</li>
              <li>- Atmosphère chaleureuse et raffinée</li>
              <li>- Service personnalisé d'exception</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- RIGHT COLUMN: Booking Flow -->
      <section class="booking-section glass-panel animate-fade-in">
        <div v-if="bookingStore.bookingSuccess">
          <LuxuryTicket
            :bookingSuccess="bookingStore.bookingSuccess"
            :formattedDate="formatDateLabelShort(bookingStore.bookingSuccess.slot.date)"
            :copiedToken="copiedToken"
            :copiedLink="copiedLink"
            :manageUrl="manageUrl"
            @copy-token="copyTokenToClipboard"
            @copy-link="copyLinkToClipboard"
          />
        </div>

        <div v-else>
          <h2 class="booking-title"> Réserver une table</h2>

          <DateChipSelector
            :dates="dates"
            :selectedDate="selectedDate"
            @select="selectDate"
          />

          <SlotGridSelector
            :slots="restoStore.slots"
            :selectedSlot="selectedSlot"
            :pendingSlots="restoStore.pendingSlots"
            @select="selectSlot"
          />

          <transition name="slide-fade">
            <BookingForm
              v-if="selectedSlot"
              :apiErrors="bookingStore.apiErrors"
              :generalError="bookingStore.generalError"
              :isSubmitting="bookingStore.isSubmitting"
              :formattedDate="formatDateLabel(selectedDate)"
              :startTime="selectedSlot.startTime"
              @submit="handleBook"
            />
          </transition>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRestaurantStore } from '~/stores/restaurantStore'
import { useReservationStore } from '~/stores/reservationStore'
import DateChipSelector from '~/presentation/components/DateChipSelector.vue'
import SlotGridSelector from '~/presentation/components/SlotGridSelector.vue'
import BookingForm from '~/presentation/components/BookingForm.vue'
import LuxuryTicket from '~/presentation/components/LuxuryTicket.vue'

useHead({
  title: 'Eat and Rest — Détails',
})

const route = useRoute()
const restaurantId = route.params.id as string

const restoStore = useRestaurantStore()
const bookingStore = useReservationStore()

const selectedSlot = ref<any | null>(null)

// Generate next 7 days programmatically starting from today
const dates = computed(() => {
  const list = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const key = `${yyyy}-${mm}-${dd}`
    
    let label = ''
    if (i === 0) label = "Aujourd'hui"
    else if (i === 1) label = "Demain"
    else {
      label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
      label = label.charAt(0).toUpperCase() + label.slice(1)
    }
    
    list.push({ key, label })
  }
  return list
})

const selectedDate = ref(dates.value[0].key)

onMounted(async () => {
  bookingStore.resetBooking()
  await restoStore.fetchRestaurant(restaurantId)
  await restoStore.fetchSlots(restaurantId, selectedDate.value)
})

watch(selectedDate, async () => {
  selectedSlot.value = null
  await restoStore.fetchSlots(restaurantId, selectedDate.value)
})

const selectDate = (dateKey: string) => {
  selectedDate.value = dateKey
}

const selectSlot = (slot: any) => {
  selectedSlot.value = slot
}

const handleBook = async (form: any) => {
  if (!selectedSlot.value) return
  try {
    await bookingStore.createBooking({
      restaurantId,
      timeSlotId: selectedSlot.value.id,
      covers: Number(form.covers),
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone
    })
    
    // Refresh slots immediately to keep visual inventory accurate
    await restoStore.fetchSlots(restaurantId, selectedDate.value)
  } catch (error) {
    // Error caught by the store
  }
}

// Copy URL & Token system
const copiedToken = ref(false)
const copiedLink = ref(false)
const manageUrl = computed(() => {
  if (!bookingStore.bookingSuccess) return ''
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/manage?token=${bookingStore.bookingSuccess.token}`
})

const copyTokenToClipboard = () => {
  if (navigator.clipboard && bookingStore.bookingSuccess) {
    navigator.clipboard.writeText(bookingStore.bookingSuccess.token)
    copiedToken.value = true
    setTimeout(() => {
      copiedToken.value = false
    }, 3000)
  }
}

const copyLinkToClipboard = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(manageUrl.value)
    copiedLink.value = true
    setTimeout(() => {
      copiedLink.value = false
    }, 3000)
  }
}

// Display formatters
const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const formatDateLabelShort = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.back-navigation {
  margin-bottom: 24px;
}

.back-link {
  font-family: var(--font-title);
  font-weight: 600;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.back-link span {
  transform: rotate(180deg);
  display: inline-block;
}

.back-link:hover {
  color: var(--primary);
}

/* Detail page grid layout */
.detail-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: start;
}

/* Restaurant Details Column */
.restaurant-info-card {
  overflow: hidden;
}

.image-header {
  position: relative;
  width: 100%;
  height: 320px;
}

.header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cuisine-tag {
  position: absolute;
  bottom: 20px;
  left: 24px;
  background: var(--primary);
  color: var(--bg-base);
  padding: 6px 16px;
  font-family: var(--font-title);
  font-weight: 800;
  font-size: 0.85rem;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-gold);
}

.info-content {
  padding: 32px;
}

.resto-name {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--text-primary);
  text-align: left;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.92rem;
}

.resto-description {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 32px;
  text-align: left;
}

/* Restaurant Highlights */
.resto-highlights {
  text-align: left;
  background: var(--bg-surface-elevated);
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.highlights-title {
  font-size: 1rem;
  color: var(--primary);
  margin-bottom: 14px;
}

.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.highlights-list li {
  font-size: 0.92rem;
  color: var(--text-secondary);
  position: relative;
  padding-left: 20px;
}


/* Booking Section */
.booking-section {
  padding: 32px;
  text-align: center;
}

.booking-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 28px;
  letter-spacing: -0.01em;
  text-align: left;
}

/* Transitions */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
