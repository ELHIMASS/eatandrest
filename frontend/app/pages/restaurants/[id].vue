<template>
  <div class="restaurant-detail-page container">
    <!-- Back to home -->
    <div class="back-navigation animate-fade-in">
      <NuxtLink to="/" class="back-link">
        <span>➔</span> Retour aux restaurants
      </NuxtLink>
    </div>

    <!-- Error if restaurant loading failed -->
    <div v-if="!restaurant && !pendingResto" class="error-panel glass-panel">
      <h2>Restaurant introuvable</h2>
      <p>Nous n'avons pas pu charger les informations de ce restaurant.</p>
      <NuxtLink to="/" class="btn btn-primary">Retour à l'accueil</NuxtLink>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="detail-grid">
      
      <!-- LEFT COLUMN: Restaurant Details -->
      <section class="restaurant-info-card glass-panel animate-fade-in" v-if="restaurant">
        <div class="image-header">
          <img :src="restaurant.imageUrl" :alt="restaurant.name" class="header-image" />
          <div class="cuisine-tag">{{ restaurant.cuisineType }}</div>
        </div>
        <div class="info-content">
          <h1 class="resto-name">{{ restaurant.name }}</h1>
          <div class="address-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{{ restaurant.address }}</span>
          </div>
          <p class="resto-description">{{ restaurant.description }}</p>

          <div class="ambiance-details">
            <h3>✦ L'expérience culinaire</h3>
            <ul>
              <li>Ingrédients frais et sélectionnés de saison</li>
              <li>Atmosphère chaleureuse et raffinée</li>
              <li>Service personnalisé d'exception</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="booking-section glass-panel animate-fade-in" v-if="restaurant">
        
        <div v-if="bookingSuccess" class="success-screen animate-fade-in">
          <div class="luxury-badge-stamp">
            <div class="stamp-star">✦</div>
            <span class="stamp-text">EAT AND REST</span>
          </div>

          <h2 class="success-title">Invitation d'Exception</h2>
          <p class="success-subtitle">Votre table a été réservée avec succès.</p>

          <div class="luxury-ticket">
            <div class="ticket-header">
              <div class="ticket-brand">✦ TABLE PRIVÉE ✦</div>
              <div class="ticket-indicator">Confirmée</div>
            </div>

            <div class="ticket-body">
              <div class="ticket-row main-restaurant">
                <span class="ticket-label">Établissement</span>
                <h3 class="ticket-value-resto">{{ bookingSuccess.restaurant.name }}</h3>
              </div>

              <div class="ticket-grid">
                <div class="ticket-col">
                  <span class="ticket-label">Date</span>
                  <span class="ticket-value">{{ formatDateLabelShort(bookingSuccess.slot.date) }}</span>
                </div>
                <div class="ticket-col">
                  <span class="ticket-label">Heure</span>
                  <span class="ticket-value">{{ bookingSuccess.slot.startTime }}</span>
                </div>
              </div>

              <div class="ticket-grid">
                <div class="ticket-col">
                  <span class="ticket-label">Couverts</span>
                  <span class="ticket-value font-gold">{{ bookingSuccess.covers }} convives</span>
                </div>
                <div class="ticket-col">
                  <span class="ticket-label">Nom</span>
                  <span class="ticket-value">{{ bookingSuccess.customer.name }}</span>
                </div>
              </div>

              <div class="ticket-punch-divider">
                <span class="punch-left"></span>
                <span class="punch-dashed"></span>
                <span class="punch-right"></span>
              </div>

              <div class="ticket-code-row">
                <div class="barcode-mock">
                  <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
                <div class="booking-ref-box">
                  <span class="ticket-label">Référence</span>
                  <span class="ticket-ref-code">{{ bookingSuccess.token.slice(0, 8).toUpperCase() }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="token-copy-box luxury-glass">
            <h4 class="copy-panel-title">✦ Code Unique &amp; Accès Direct</h4>
            <p class="token-help">Copiez le code ci-dessous pour accéder directement à votre réservation depuis la page de gestion :</p>
            
            <div class="copy-row-luxury">
              <span class="copy-row-label">Code de réservation (UUID)</span>
              <div class="copy-input-group">
                <input type="text" readonly :value="bookingSuccess.token" class="copy-input font-code" />
                <button @click="copyTokenToClipboard" class="btn btn-primary copy-btn-sm">
                  <span>{{ copiedToken ? 'Copié !' : 'Copier le code' }}</span>
                </button>
              </div>
            </div>

            <div class="copy-row-luxury margin-top-md">
              <span class="copy-row-label">Lien direct d'accès</span>
              <div class="copy-input-group">
                <input type="text" readonly :value="manageUrl" class="copy-input" />
                <button @click="copyLinkToClipboard" class="btn btn-secondary copy-btn-sm">
                  <span>{{ copiedLink ? 'Copié !' : 'Copier le lien' }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="modify-notice-box glass-panel">
            <h4 class="modify-title">✦ Besoin de modifier ?</h4>
            <p class="modify-help">Pour modifier votre réservation, veuillez contacter le restaurant directement :</p>
            <a :href="`tel:${bookingSuccess.restaurant.phone}`" class="btn btn-secondary w-full call-btn">
              <span class="call-icon">📞</span>
              <span>Appeler le restaurant ({{ bookingSuccess.restaurant.phone }})</span>
            </a>
          </div>

          <div class="success-actions">
            <NuxtLink to="/" class="btn btn-secondary w-full">Retour à l'accueil</NuxtLink>
          </div>
        </div>

        <div v-else>
          <h2 class="booking-title">✦ Réserver une table</h2>

          <div class="date-selector-wrapper">
            <label class="form-label">1. Choisissez une date</label>
            <div class="date-chips">
              <button 
                v-for="date in dates" 
                :key="date.key" 
                class="date-chip" 
                :class="{ active: selectedDate === date.key }"
                @click="selectDate(date.key)"
              >
                {{ date.label }}
              </button>
            </div>
          </div>

          <div class="slots-wrapper">
            <label class="form-label">2. Sélectionnez un créneau horaire</label>
            
            <div v-if="pendingSlots" class="slots-loading">
              <div class="spinner"></div>
              <span>Mise à jour des disponibilités...</span>
            </div>

            <div v-else-if="!slots || slots.length === 0" class="no-slots-alert">
              <p>Aucun créneau disponible pour cette date. Veuillez choisir un autre jour.</p>
            </div>

            <div v-else class="slots-grid">
              <button 
                v-for="slot in slots" 
                :key="slot.id" 
                class="slot-button"
                :class="{ 
                  'is-selected': selectedSlot?.id === slot.id,
                  'is-free': slot.status === 'free',
                  'is-nearly-full': slot.status === 'nearly_full',
                  'is-full': slot.status === 'full'
                }"
                :disabled="slot.status === 'full'"
                @click="selectedSlot = slot"
              >
                <span class="slot-time">{{ slot.startTime }}</span>
                <span class="slot-status-indicator" :class="slot.status">
                  {{ formatStatusText(slot.status) }}
                </span>
              </button>
            </div>
          </div>

          <!-- Booking Form -->
          <transition name="slide-fade">
            <div v-if="selectedSlot" class="booking-form-box border-top-subtle">
              <h3 class="form-section-title">3. Vos coordonnées</h3>
              
              <div v-if="generalError" class="form-error general-form-error animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ generalError }}</span>
              </div>

              <form @submit.prevent="handleBook">
                <!-- Covers Count Selection -->
                <div class="form-group">
                  <label class="form-label" for="covers">Nombre de couverts</label>
                  <select 
                    id="covers" 
                    v-model="bookingForm.covers" 
                    class="form-control"
                    :class="{ 'is-invalid': apiErrors.covers }"
                  >
                    <option v-for="n in 8" :key="n" :value="n">
                      {{ n }} {{ n > 1 ? 'personnes' : 'personne' }}
                    </option>
                  </select>
                  <div v-if="apiErrors.covers" class="form-error">
                    {{ apiErrors.covers }}
                  </div>
                </div>

                <!-- Customer Name -->
                <div class="form-group">
                  <label class="form-label" for="customerName">Nom complet</label>
                  <input 
                    type="text" 
                    id="customerName" 
                    v-model="bookingForm.customerName" 
                    placeholder="ex. Alice Dupont"
                    class="form-control"
                    :class="{ 'is-invalid': apiErrors.customerName }"
                  />
                  <div v-if="apiErrors.customerName" class="form-error">
                    {{ apiErrors.customerName }}
                  </div>
                </div>

                <!-- Customer Email -->
                <div class="form-group">
                  <label class="form-label" for="customerEmail">Adresse email</label>
                  <input 
                    type="email" 
                    id="customerEmail" 
                    v-model="bookingForm.customerEmail" 
                    placeholder="ex. alice@email.com"
                    class="form-control"
                    :class="{ 'is-invalid': apiErrors.customerEmail }"
                  />
                  <div v-if="apiErrors.customerEmail" class="form-error">
                    {{ apiErrors.customerEmail }}
                  </div>
                </div>

                <!-- Customer Phone -->
                <div class="form-group">
                  <label class="form-label" for="customerPhone">Numéro de téléphone</label>
                  <input 
                    type="tel" 
                    id="customerPhone" 
                    v-model="bookingForm.customerPhone" 
                    placeholder="ex. +33612345678"
                    class="form-control"
                    :class="{ 'is-invalid': apiErrors.customerPhone }"
                  />
                  <div v-if="apiErrors.customerPhone" class="form-error">
                    {{ apiErrors.customerPhone }}
                  </div>
                </div>

                <!-- Summary notice -->
                <div class="summary-notice glass-panel">
                  Réservation le <strong>{{ formatDateLabel(selectedDate) }}</strong> à <strong>{{ selectedSlot.startTime }}</strong> pour <strong>{{ bookingForm.covers }} couverts</strong>.
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="btn btn-primary w-full" 
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">Finalisation en cours...</span>
                  <span v-else>Confirmer la Réservation</span>
                </button>
              </form>
            </div>
          </transition>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const restaurantId = route.params.id as string

const { getRestaurant, getSlots, createReservation } = useApi()

// SEO metadata
useHead({
  title: 'Eat and Rest — Détails',
})

// Generate next 7 days programmatically starting from today
const dates = computed(() => {
  const list = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    
    // YYYY-MM-DD local format
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const key = `${yyyy}-${mm}-${dd}`
    
    let label = ''
    if (i === 0) label = "Aujourd'hui"
    else if (i === 1) label = "Demain"
    else {
      // e.g. "sam. 23 mai"
      label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
      // capitalize first letter
      label = label.charAt(0).toUpperCase() + label.slice(1)
    }
    
    list.push({ key, label })
  }
  return list
})

const selectedDate = ref(dates.value[0].key)

// Fetch restaurant details
const { data: restaurant, pending: pendingResto } = await useAsyncData(
  `restaurant-${restaurantId}`, 
  () => getRestaurant(restaurantId)
)

// Fetch slots for selected date
const { data: slots, pending: pendingSlots, refresh: refreshSlots } = await useAsyncData(
  `slots-${restaurantId}-${selectedDate.value}`,
  () => getSlots(restaurantId, selectedDate.value)
)

// Watch date change to refresh slots list
watch(selectedDate, () => {
  selectedSlot.value = null // reset selection when date changes
  refreshSlots()
})

const selectDate = (dateKey: string) => {
  selectedDate.value = dateKey
}

// Interactive states
const selectedSlot = ref<any | null>(null)
const isSubmitting = ref(false)
const bookingSuccess = ref<any | null>(null)

// Forms & Errors
const bookingForm = ref({
  covers: 2,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
})

const apiErrors = ref<Record<string, string>>({})
const generalError = ref('')

// Submission
const handleBook = async () => {
  if (!selectedSlot.value) return

  apiErrors.value = {}
  generalError.value = ''
  isSubmitting.value = true

  try {
    const response = await createReservation({
      restaurantId,
      timeSlotId: selectedSlot.value.id,
      covers: Number(bookingForm.value.covers),
      customerName: bookingForm.value.customerName,
      customerEmail: bookingForm.value.customerEmail,
      customerPhone: bookingForm.value.customerPhone
    })
    
    // Booking successful
    bookingSuccess.value = response
    
    // Refresh slots immediately to keep visual inventory accurate
    refreshSlots()
  } catch (error: any) {
    // Check if validation/backend error has a field property
    if (error.field) {
      apiErrors.value[error.field] = error.message
    } else {
      generalError.value = error.message || "Une erreur est survenue lors de la soumission de la réservation."
    }
  } finally {
    isSubmitting.value = false
  }
}

// Copy URL & Token system
const copiedToken = ref(false)
const copiedLink = ref(false)
const manageUrl = computed(() => {
  if (!bookingSuccess.value) return ''
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/manage?token=${bookingSuccess.value.token}`
})

const copyTokenToClipboard = () => {
  if (navigator.clipboard && bookingSuccess.value) {
    navigator.clipboard.writeText(bookingSuccess.value.token)
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
const formatStatusText = (status: string) => {
  switch (status) {
    case 'free': return 'Disponible'
    case 'nearly_full': return 'Presque plein'
    case 'full': return 'Complet'
    default: return ''
  }
}

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
}

.address-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 24px;
}

.resto-description {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 32px;
}

.ambiance-details {
  border-top: 1px solid var(--border-subtle);
  padding-top: 24px;
}

.ambiance-details h3 {
  font-size: 1.2rem;
  color: var(--primary);
  margin-bottom: 12px;
}

.ambiance-details ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ambiance-details li {
  color: var(--text-secondary);
  font-size: 0.95rem;
  position: relative;
  padding-left: 20px;
}

.ambiance-details li::before {
  content: '✦';
  color: var(--primary);
  position: absolute;
  left: 0;
}

/* Booking Column */
.booking-section {
  padding: 32px;
}

.booking-title {
  font-size: 1.8rem;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 12px;
}

/* Date chips styles */
.date-selector-wrapper {
  margin-bottom: 24px;
}

.date-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0 12px 0;
  scrollbar-width: thin;
}

.date-chip {
  flex-shrink: 0;
  padding: 10px 16px;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-family: var(--font-title);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: var(--transition-normal);
}

.date-chip:hover {
  border-color: var(--primary);
  color: var(--text-primary);
}

.date-chip.active {
  background: var(--bg-surface-elevated);
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-glow);
}

/* Slots Grid styles */
.slots-wrapper {
  margin-bottom: 24px;
}

.slots-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  padding: 20px 0;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-slots-alert {
  background: var(--error-glow);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--text-primary);
  padding: 16px;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.95rem;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.slot-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 6px;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
}

.slot-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.2);
  border-color: transparent;
}

.slot-time {
  font-family: var(--font-title);
  font-size: 1.1rem;
  font-weight: 700;
}

.slot-status-indicator {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.slot-status-indicator.free { color: var(--success); }
.slot-status-indicator.nearly_full { color: var(--warning); }
.slot-status-indicator.full { color: var(--error); }

/* Hover states for slot availability */
.slot-button:not(:disabled):hover {
  transform: scale(1.03);
}

.slot-button.is-free:not(:disabled):hover {
  border-color: var(--success);
  box-shadow: 0 0 10px var(--success-glow);
}

.slot-button.is-nearly-full:not(:disabled):hover {
  border-color: var(--warning);
  box-shadow: 0 0 10px var(--warning-glow);
}

.slot-button.is-selected {
  background: var(--primary) !important;
  color: var(--bg-base) !important;
  border-color: var(--primary) !important;
  box-shadow: var(--shadow-gold) !important;
}

.slot-button.is-selected .slot-status-indicator {
  color: var(--bg-base) !important;
}

/* Booking Form Elements */
.booking-form-box {
  margin-top: 32px;
  animation: slideDown var(--transition-normal) forwards;
}

.border-top-subtle {
  border-top: 1px solid var(--border-subtle);
  padding-top: 24px;
}

.form-section-title {
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: var(--primary);
}

.general-form-error {
  background: var(--error-glow);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--error);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.summary-notice {
  padding: 16px;
  margin-bottom: 24px;
  font-size: 0.95rem;
  border-color: var(--border-focus);
  text-align: center;
}

.w-full {
  width: 100%;
}

/* Upgraded Luxury Receipt Layout */
.success-screen {
  text-align: center;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.luxury-badge-stamp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px double var(--primary);
  background: rgba(212, 163, 89, 0.05);
  box-shadow: 0 0 15px var(--primary-glow);
  margin-bottom: 20px;
  animation: pulse-gold 2s infinite ease-in-out;
}

.stamp-star {
  font-size: 1.8rem;
  color: var(--primary);
  line-height: 1;
}

.stamp-text {
  font-family: var(--font-title);
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--primary);
  margin-top: 4px;
}

@keyframes pulse-gold {
  0% { transform: scale(1); box-shadow: 0 0 10px var(--primary-glow); }
  50% { transform: scale(1.04); box-shadow: 0 0 25px rgba(212, 163, 89, 0.25); }
  100% { transform: scale(1); box-shadow: 0 0 10px var(--primary-glow); }
}

.success-title {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin-bottom: 6px;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.success-subtitle {
  color: var(--text-secondary);
  font-size: 1.05rem;
  margin-bottom: 36px;
  max-width: 320px;
  line-height: 1.4;
}

/* Luxury Gastronomy Ticket */
.luxury-ticket {
  background: var(--bg-surface);
  border: 1px solid rgba(197, 155, 39, 0.25);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 440px;
  box-shadow: 0 15px 35px rgba(28, 24, 22, 0.06);
  position: relative;
  overflow: hidden;
  margin-bottom: 36px;
}

.luxury-ticket::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--bg-base) 50%, var(--primary) 100%);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(197, 155, 39, 0.15);
  background: rgba(197, 155, 39, 0.02);
}

.ticket-brand {
  font-family: var(--font-title);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--primary);
}

.ticket-indicator {
  font-family: var(--font-title);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--success);
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  letter-spacing: 0.05em;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.ticket-body {
  padding: 24px;
}

.main-restaurant {
  flex-direction: column;
  align-items: flex-start !important;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.ticket-value-resto {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-top: 4px;
}

.ticket-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.ticket-col {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.ticket-label {
  font-family: var(--font-title);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.ticket-value {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 2px;
}

.font-gold {
  color: var(--primary) !important;
}

/* Punch line */
.ticket-punch-divider {
  position: relative;
  height: 20px;
  margin: 12px -24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.punch-left, .punch-right {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg-base); /* Matches app background */
  border: 1px solid rgba(197, 155, 39, 0.25);
  top: 50%;
  transform: translateY(-50%);
}

.punch-left {
  left: -8px;
  clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%);
}

.punch-right {
  right: -8px;
  clip-path: polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%, 0% 50%);
}

.punch-dashed {
  width: 100%;
  height: 1px;
  border-top: 1px dashed rgba(197, 155, 39, 0.25);
}

.ticket-code-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
}

.barcode-mock {
  display: flex;
  gap: 2px;
  height: 28px;
  opacity: 0.4;
}

.barcode-mock span {
  width: 2px;
  background: var(--text-secondary);
  height: 100%;
}

.barcode-mock span:nth-child(2n) { width: 4px; }
.barcode-mock span:nth-child(3n) { width: 1px; }

.booking-ref-box {
  text-align: right;
}

.ticket-ref-code {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary);
  display: block;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

/* Copy panel block styling */
.token-copy-box {
  width: 100%;
  max-width: 440px;
  background: var(--bg-surface);
  border: 1px solid var(--border-focus);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
  box-shadow: 0 10px 25px rgba(28, 24, 22, 0.04);
}

.copy-panel-title {
  font-size: 1rem;
  color: var(--primary);
  margin-bottom: 8px;
}

.token-help {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
}

.copy-input-group {
  display: flex;
  gap: 10px;
}

.copy-input {
  flex-grow: 1;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  padding: 12px 14px;
  font-size: 0.85rem;
  font-family: monospace;
}

.copy-btn {
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
}

.copy-icon-svg {
  flex-shrink: 0;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

/* Luxury Copy Row Styling */
.copy-row-luxury {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.copy-row-label {
  font-family: var(--font-title);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.copy-btn-sm {
  padding: 10px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 125px;
  justify-content: center;
  display: inline-flex;
}

.font-code {
  font-family: monospace !important;
  color: var(--primary) !important;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.margin-top-md {
  margin-top: 16px;
}

/* Modify Call Box */
.modify-notice-box {
  width: 100%;
  max-width: 440px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
  text-align: left;
  box-shadow: 0 4px 15px rgba(28, 24, 22, 0.02);
}

.modify-title {
  font-size: 0.95rem;
  color: var(--primary);
  margin-bottom: 6px;
}

.modify-help {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 14px;
}

.call-btn {
  background: rgba(197, 155, 39, 0.06) !important;
  color: var(--primary) !important;
  border: 1px solid rgba(197, 155, 39, 0.2) !important;
  font-size: 0.85rem !important;
  font-weight: 700 !important;
  padding: 10px 18px !important;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.call-btn:hover {
  background: rgba(197, 155, 39, 0.12) !important;
  border-color: var(--primary) !important;
}

.call-icon-svg {
  flex-shrink: 0;
}
</style>
