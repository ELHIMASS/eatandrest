<template>
  <div class="manage-page container">
    <div class="page-header text-center animate-fade-in">
      <h1 class="page-title">✦ Gestion de Réservation</h1>
      <p class="page-subtitle">Visualisez vos informations ou demandez l'annulation de votre table.</p>
    </div>

    <!-- Search Form (Shown when no reservation is currently loaded) -->
    <div v-if="!reservation" class="search-panel glass-panel animate-fade-in">
      <h2 class="panel-title">Retrouver ma réservation</h2>
      <p class="panel-subtitle">Saisissez le code de réservation opaque (UUID) qui vous a été fourni lors de votre confirmation.</p>

      <form @submit.prevent="submitSearch">
        <div class="form-group">
          <label class="form-label" for="token">Code de réservation</label>
          <input 
            type="text" 
            id="token" 
            v-model="tokenInput" 
            placeholder="ex. 123e4567-e89b-12d3-a456-426614174000" 
            class="form-control"
            :class="{ 'is-invalid': errorMsg }"
          />
          <div v-if="errorMsg" class="form-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ errorMsg }}</span>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
          <span v-if="isLoading">Recherche en cours...</span>
          <span v-else>Rechercher</span>
        </button>
      </form>
    </div>

    <!-- Reservation Display Panel -->
    <div v-else class="reservation-panel-grid animate-fade-in">
      
      <!-- Detailed Receipt Card -->
      <section class="receipt-section glass-panel">
        <div class="receipt-header">
          <h2 class="receipt-title">Récapitulatif de Table</h2>
          <div class="receipt-badge-wrapper">
            <span v-if="reservation.status === 'confirmed'" class="badge badge-free">Confirmé</span>
            <span v-else class="badge badge-full">Annulé</span>
          </div>
        </div>

        <div class="receipt-body">
          <div class="receipt-row">
            <span class="label">Restaurant</span>
            <span class="value">{{ reservation.restaurant.name }}</span>
          </div>
          <div class="receipt-row">
            <span class="label">Date de réservation</span>
            <span class="value">{{ formatDateLabel(reservation.slot.date) }}</span>
          </div>
          <div class="receipt-row">
            <span class="label">Horaire</span>
            <span class="value">{{ reservation.slot.startTime }} – {{ reservation.slot.endTime }}</span>
          </div>
          <div class="receipt-row">
            <span class="label">Couverts</span>
            <span class="value">{{ reservation.covers }} personnes</span>
          </div>
          
          <div class="receipt-divider">Coordonnées Client</div>

          <div class="receipt-row">
            <span class="label">Nom complet</span>
            <span class="value">{{ reservation.customer.name }}</span>
          </div>
          <div class="receipt-row">
            <span class="label">Adresse email</span>
            <span class="value">{{ reservation.customer.email }}</span>
          </div>
          <div class="receipt-row">
            <span class="label">Téléphone</span>
            <span class="value">{{ reservation.customer.phone }}</span>
          </div>
        </div>

        <!-- Token display footer -->
        <div class="receipt-footer">
          <span>Code de suivi : <code>{{ currentToken }}</code></span>
        </div>
      </section>

      <!-- Manage Options & Cancellation Screen -->
      <section class="actions-section glass-panel">
        <!-- Message box shown when reservation is cancelled -->
        <div v-if="cancellationSuccessMessage || reservation.status === 'cancelled'" class="cancelled-success-box animate-fade-in">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="var(--success)" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3>Réservation Annulée</h3>
          <blockquote class="server-message">
            "{{ cancellationSuccessMessage || 'Votre réservation a été annulée avec succès.' }}"
          </blockquote>
          
          <p class="helper-text">Votre table a été libérée et les disponibilités ont été mises à jour en temps réel pour les autres convives.</p>
          <NuxtLink to="/" class="btn btn-primary w-full margin-top-lg">Découvrir d'autres tables</NuxtLink>
        </div>

        <div v-else class="active-management-box">
          <h3 class="action-panel-title">✦ Gérer ma table</h3>
          <p class="action-description">Vous souhaitez modifier l'organisation de votre soirée ou libérer votre créneau ? Vous pouvez annuler votre réservation ci-dessous.</p>

          <div class="alert-box glass-panel warning">
            <div class="alert-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Rappel Important</span>
            </div>
            <p>L'annulation libère immédiatement les places dans le restaurant. Cette action est irréversible.</p>
          </div>
          <div class="alert-box glass-panel info-box">
            <div class="alert-title info-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Besoin de modifier ?</span>
            </div>
            <p class="modify-help-text">Pour modifier votre réservation, veuillez contacter le restaurant directement :</p>
            <a :href="`tel:${reservation.restaurant.phone}`" class="btn btn-secondary w-full call-btn-manage">
              <span class="call-icon">📞</span>
              <span>Appeler le restaurant ({{ reservation.restaurant.phone }})</span>
            </a>
          </div>

          <div class="action-buttons-group">
            <button 
              @click="handleCancel" 
              class="btn btn-danger w-full"
              :disabled="isCancelling"
            >
              <span v-if="isCancelling">Annulation en cours...</span>
              <span v-else>Annuler ma réservation</span>
            </button>
            <button @click="resetSearch" class="btn btn-secondary w-full">
              Consulter une autre réservation
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

// SEO Metadata
useHead({
  title: 'Eat and Rest — Gérer ma réservation',
})

const route = useRoute()
const router = useRouter()
const { getReservationByToken, cancelReservation } = useApi()

// Input states
const tokenInput = ref('')
const currentToken = ref('')
const reservation = ref<any | null>(null)

// Action indicators
const isLoading = ref(false)
const isCancelling = ref(false)
const errorMsg = ref('')
const cancellationSuccessMessage = ref('')

// Check URL query parameters on load
onMounted(async () => {
  const token = route.query.token as string
  if (token) {
    tokenInput.value = token
    await fetchReservation(token)
  }
})

// Query reservation logic
const fetchReservation = async (token: string) => {
  if (!token.trim()) return

  isLoading.value = true
  errorMsg.value = ''
  cancellationSuccessMessage.value = ''

  try {
    const res = await getReservationByToken(token.trim())
    reservation.value = res
    currentToken.value = token.trim()

    // Sync query parameters with routing state
    router.replace({ query: { token: token.trim() } })
  } catch (error: any) {
    reservation.value = null
    errorMsg.value = error.message || "Aucune réservation trouvée pour ce code de suivi. Veuillez vérifier votre saisie."
  } finally {
    isLoading.value = false
  }
}

const submitSearch = () => {
  fetchReservation(tokenInput.value)
}

// Cancellation logic
const handleCancel = async () => {
  if (!reservation.value || !currentToken.value) return

  // Ask for explicit user confirmation before destructive action
  if (!confirm("Souhaitez-vous vraiment annuler votre réservation ?")) return

  isCancelling.value = true
  errorMsg.value = ''

  try {
    const res = await cancelReservation(reservation.value.id, currentToken.value)
    
    // Store exact backend response message
    cancellationSuccessMessage.value = res.message
    
    // Update local reservation state visually (sets status to 'cancelled')
    reservation.value = res.reservation
  } catch (error: any) {
    errorMsg.value = error.message || "Une erreur est survenue lors de la demande d'annulation."
  } finally {
    isCancelling.value = false
  }
}

// Reset / Search another reservation
const resetSearch = () => {
  reservation.value = null
  tokenInput.value = ''
  currentToken.value = ''
  cancellationSuccessMessage.value = ''
  errorMsg.value = ''
  router.replace({ query: {} })
}

// Display date formatting helper
const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.page-header {
  margin-bottom: 48px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ffffff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

/* Manual Search Panel */
.search-panel {
  max-width: 550px;
  margin: 0 auto;
  padding: 40px;
}

.panel-title {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.panel-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 28px;
  line-height: 1.5;
}

.w-full {
  width: 100%;
}

/* Reservation visual panels */
.reservation-panel-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: start;
}

/* Receipt design card */
.receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid var(--border-subtle);
}

.receipt-title {
  font-size: 1.3rem;
}

.receipt-body {
  padding: 32px;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.receipt-row .label {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.receipt-row .value {
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
}

.receipt-divider {
  font-family: var(--font-title);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  border-bottom: 1px solid var(--border-subtle);
  padding: 24px 0 8px 0;
  margin-bottom: 12px;
}

.receipt-footer {
  padding: 16px 32px;
  background: rgba(0, 0, 0, 0.15);
  border-top: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.receipt-footer code {
  color: var(--primary);
  font-family: monospace;
  font-weight: bold;
}

/* Action panel design card */
.actions-section {
  padding: 32px;
}

.action-panel-title {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: var(--primary);
}

.action-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
}

.alert-box {
  padding: 16px;
  border-color: rgba(245, 158, 11, 0.3);
  margin-bottom: 24px;
}

.alert-box.warning {
  background: var(--warning-glow);
}

.alert-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--warning);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.alert-box p {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
}

.action-buttons-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Success Cancellation Screen */
.cancelled-success-box {
  text-align: center;
  padding: 12px 0;
}

.cancelled-success-box h3 {
  font-size: 1.6rem;
  color: var(--success);
  margin: 12px 0;
}

.cancelled-success-box .icon-wrapper {
  color: var(--success);
  display: inline-flex;
}

/* STYLISH QUOTE FOR EXACT BACKEND MESSAGE DISPLAY */
.server-message {
  font-family: var(--font-title);
  font-size: 1.2rem;
  font-style: italic;
  font-weight: 600;
  color: var(--text-primary);
  background: rgba(16, 185, 129, 0.08);
  border-left: 3px solid var(--success);
  padding: 16px;
  margin: 24px 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  line-height: 1.4;
  text-align: left;
}

.helper-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.margin-top-lg {
  margin-top: 24px;
}

@media (max-width: 900px) {
  .reservation-panel-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

/* Modify Call Box manage styles */
.info-box {
  background: rgba(197, 155, 39, 0.05) !important;
  border-color: rgba(197, 155, 39, 0.2) !important;
  margin-bottom: 24px;
}

.info-title {
  color: var(--primary) !important;
}

.modify-help-text {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 12px;
}

.call-btn-manage {
  background: #ffffff !important;
  color: var(--text-primary) !important;
  border: 1px solid rgba(28, 24, 22, 0.12) !important;
  font-size: 0.82rem !important;
  padding: 10px 16px !important;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.call-btn-manage:hover {
  background: var(--bg-surface-elevated) !important;
  border-color: var(--primary) !important;
  color: var(--primary) !important;
}

.call-icon-svg {
  flex-shrink: 0;
}
</style>
