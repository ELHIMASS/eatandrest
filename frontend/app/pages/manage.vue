<template>
  <div class="manage-page container">
    <header class="page-header text-center">
      <h1 class="page-title animate-fade-in">Suivi de Réservation</h1>
      <p class="page-subtitle animate-fade-in">Consultez, gérez ou annulez votre table en un clic.</p>
    </header>

    <div class="manage-content">
      <!-- STEP 1: Search Form -->
      <section v-if="!store.activeReservation && !store.cancellationSuccessMessage" class="search-section glass-panel animate-fade-in">
        <h2 class="section-title">Rechercher une réservation</h2>
        <p class="section-desc">Entrez le code de suivi unique reçu lors de votre confirmation.</p>

        <form @submit.prevent="submitSearch">
          <div class="form-group text-left">
            <label class="form-label" for="token">Code de suivi unique</label>
            <div class="search-input-wrapper">
              <input 
                type="text" 
                id="token" 
                v-model="tokenInput" 
                placeholder="ex. 8b6a3c9e-5f82-411a-8e2b-..."
                class="form-control"
                required
              />
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="store.isLoading"
              >
                <span v-if="store.isLoading">Recherche...</span>
                <span v-else>Rechercher</span>
              </button>
            </div>
            <div v-if="store.generalError" class="form-error general-form-error animate-fade-in">
              <span>⚠️</span>
              <span>{{ store.generalError }}</span>
            </div>
          </div>
        </form>
      </section>

      <!-- STEP 2: Main Panel Display -->
      <section v-else class="reservation-panel-grid animate-fade-in">
        <!-- LEFT: Reservation summary ticket details -->
        <div class="reservation-details-panel glass-panel" v-if="displayReservation">
          <div class="panel-header-luxury">
            <span class="status-indicator" :class="store.activeReservation ? 'confirmed' : 'cancelled'">
              {{ store.activeReservation ? 'Réservation Active' : 'Annulée' }}
            </span>
            <span class="brand-signature">EAT &amp; REST.</span>
          </div>

          <div class="receipt-body">
            <!-- Restaurant Info -->
            <div class="receipt-section border-bottom">
              <span class="receipt-label">Établissement</span>
              <h2 class="receipt-value-title">{{ displayReservation.restaurant.name }}</h2>
              <span class="receipt-sub-value">{{ displayReservation.restaurant.address }}</span>
            </div>

            <!-- Date & Cover Grid -->
            <div class="receipt-grid border-bottom">
              <div class="receipt-col">
                <span class="receipt-label">Date de visite</span>
                <span class="receipt-value">{{ formatDateLabel(displayReservation.slot.date) }}</span>
              </div>
              <div class="receipt-col">
                <span class="receipt-label">Horaire</span>
                <span class="receipt-value">{{ displayReservation.slot.startTime }}</span>
              </div>
            </div>

            <div class="receipt-grid border-bottom">
              <div class="receipt-col">
                <span class="receipt-label">Couverts réservés</span>
                <span class="receipt-value highlight-gold">{{ displayReservation.covers }} personnes</span>
              </div>
              <div class="receipt-col">
                <span class="receipt-label">Nom complet</span>
                <span class="receipt-value">{{ displayReservation.customer.name }}</span>
              </div>
            </div>

            <!-- Client Credentials Details -->
            <div class="receipt-section text-left">
              <span class="receipt-label">Coordonnées de contact</span>
              <div class="credential-row">
                <span class="credential-icon">✉</span>
                <span class="credential-val">{{ displayReservation.customer.email }}</span>
              </div>
              <div class="credential-row margin-top-xs">
                <span class="credential-icon">📞</span>
                <span class="credential-val">{{ displayReservation.customer.phone }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Live cancel action card / cancel success card -->
        <div class="reservation-actions-panel glass-panel">
          <!-- State A: Cancellation Successful -->
          <div v-if="store.cancellationSuccessMessage" class="cancel-success-box text-center animate-fade-in">
            <div class="circle-success-icon" style="font-size: 2.5rem; margin-bottom: 8px;">
              <span>✅</span>
            </div>
            <h3>Réservation Annulée</h3>
            
            <blockquote class="server-message">
              "{{ store.cancellationSuccessMessage }}"
            </blockquote>
            
            <p class="helper-text">Votre table a été libérée et les disponibilités ont été mises à jour en temps réel pour les autres convives.</p>
            <NuxtLink to="/" class="btn btn-primary w-full margin-top-lg">Découvrir d'autres tables</NuxtLink>
          </div>

          <!-- State B: Active booking management options -->
          <div v-else-if="store.activeReservation" class="active-management-box">
            <h3 class="action-panel-title">Gérer ma table</h3>
            <p class="action-description">Vous souhaitez modifier l'organisation de votre soirée ou libérer votre créneau ? Vous pouvez annuler votre réservation ci-dessous.</p>

            <div class="alert-box glass-panel warning">
              <div class="alert-title">
                <span>⚠️</span>
                <span>Rappel Important</span>
              </div>
              <p>L'annulation libère immédiatement les places dans le restaurant. Cette action est irréversible.</p>
            </div>

            <!-- Modify Notice Section -->
            <div class="alert-box glass-panel info-box">
              <div class="alert-title info-title">
                <span>💡</span>
                <span>Besoin de modifier ?</span>
              </div>
              <p class="modify-help-text">Pour modifier votre réservation, veuillez contacter le restaurant directement :</p>
              <a :href="`tel:${store.activeReservation.restaurant.phone}`" class="btn btn-secondary w-full call-btn-manage">
                <span>📞 Appeler le restaurant ({{ store.activeReservation.restaurant.phone }})</span>
              </a>
            </div>

            <div class="action-buttons-group">
              <button 
                @click="handleCancel" 
                class="btn btn-danger w-full"
                :disabled="store.isCancelling"
              >
                <span v-if="store.isCancelling">Annulation en cours...</span>
                <span v-else>Annuler ma réservation</span>
              </button>
              <button @click="resetSearch" class="btn btn-secondary w-full">
                Consulter une autre réservation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservationStore } from '~/stores/reservationStore'

useHead({
  title: 'Eat and Rest — Gérer ma réservation',
})

const route = useRoute()
const router = useRouter()
const store = useReservationStore()

const tokenInput = ref('')
const currentToken = ref('')

const displayReservation = computed(() => {
  return store.activeReservation || store.bookingSuccess
})

onMounted(async () => {
  store.resetBooking()
  const token = route.query.token as string
  if (token) {
    tokenInput.value = token
    await lookupReservation(token)
  }
})

const submitSearch = async () => {
  await lookupReservation(tokenInput.value)
}

const lookupReservation = async (token: string) => {
  try {
    await store.fetchReservation(token)
    currentToken.value = token.trim()
    router.replace({ query: { token: token.trim() } })
  } catch (error) {
    // handled by store
  }
}

const handleCancel = async () => {
  if (!store.activeReservation || !currentToken.value) return
  if (!confirm("Souhaitez-vous vraiment annuler votre réservation ?")) return
  try {
    await store.cancelBooking(store.activeReservation.id, currentToken.value)
  } catch (error) {
    // handled by store
  }
}

const resetSearch = () => {
  store.resetBooking()
  tokenInput.value = ''
  currentToken.value = ''
  router.replace({ query: {} })
}

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
  background: var(--primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.search-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.section-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.search-input-wrapper {
  display: flex;
  gap: 12px;
}

.form-control {
  flex-grow: 1;
  padding: 14px 16px;
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-fast);
}

.form-control:focus {
  border-color: var(--primary);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.form-error {
  color: var(--error);
  font-size: 0.82rem;
  font-weight: 600;
  margin-top: 8px;
}

.general-form-error {
  background: var(--error-glow);
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(194, 65, 12, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  color: var(--error);
}

/* Panel Layout Details */
.reservation-panel-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: start;
}

.reservation-details-panel {
  overflow: hidden;
}

.panel-header-luxury {
  background: var(--bg-surface-elevated);
  border-bottom: 1.5px dashed var(--border-subtle);
  padding: 20px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-indicator {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  letter-spacing: 0.05em;
}

.status-indicator.confirmed {
  color: var(--primary);
  background: rgba(197, 155, 39, 0.08);
  border: 1px solid rgba(197, 155, 39, 0.25);
}

.status-indicator.cancelled {
  color: var(--error);
  background: var(--error-glow);
  border: 1px solid rgba(194, 65, 12, 0.25);
}

.brand-signature {
  font-family: var(--font-title);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.receipt-body {
  padding: 28px;
}

.receipt-section {
  padding: 16px 0;
  text-align: left;
}

.receipt-section.border-bottom {
  border-bottom: 1px solid var(--border-subtle);
  padding-top: 0;
}

.receipt-label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.receipt-value-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.receipt-sub-value {
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.receipt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px 0;
  text-align: left;
}

.receipt-grid.border-bottom {
  border-bottom: 1px solid var(--border-subtle);
}

.receipt-col {
  display: flex;
  flex-direction: column;
}

.receipt-value {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.receipt-value.highlight-gold {
  color: var(--primary);
}

.credential-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.credential-icon {
  font-size: 1rem;
  color: var(--primary);
}

.credential-val {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.margin-top-xs {
  margin-top: 8px;
}

/* Actions Sidebar */
.reservation-actions-panel {
  padding: 32px;
  text-align: left;
}

.action-panel-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.action-description {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 24px;
}

.alert-box {
  padding: 16px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  border: 1px solid var(--border-subtle);
}

.alert-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 0.88rem;
  margin-bottom: 8px;
}

.alert-box.warning {
  background: var(--warning-glow);
  border-color: rgba(217, 119, 6, 0.15);
}

.alert-box.warning .alert-title {
  color: var(--warning);
}

.alert-box.warning p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
}

.action-buttons-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cancel-success-box {
  padding: 16px 0;
}

.circle-success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cancel-success-box h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-top: 16px;
  margin-bottom: 12px;
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

@media (max-width: 900px) {
  .reservation-panel-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
