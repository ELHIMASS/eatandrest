<template>
  <div class="success-screen animate-fade-in">
    <div class="badge-stamp">
      <div class="stamp-star">★</div>
      <span class="stamp-text">EAT AND REST</span>
    </div>

    <h2 class="success-title">Invitation d'Exception</h2>
    <p class="success-subtitle">Votre table a été réservée avec succès.</p>

    <!-- Ticket Container -->
    <div class="ticket-card">
      <div class="ticket-header">
        <div class="ticket-brand">TABLE PRIVÉE</div>
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
            <span class="ticket-value">{{ formattedDate }}</span>
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

        <!-- Punch out divider line -->
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

    <!-- copy credentials card -->
    <div class="token-copy-box">
      <h4 class="copy-panel-title">Code Unique &amp; Accès Direct</h4>
      <p class="token-help">Copiez le code ci-dessous pour accéder directement à votre réservation depuis la page de gestion :</p>
      
      <div class="copy-row">
        <span class="copy-row-label">Code de réservation (UUID)</span>
        <div class="copy-input-group">
          <input type="text" readonly :value="bookingSuccess.token" class="copy-input font-code" />
          <button @click="$emit('copy-token')" class="btn btn-primary copy-btn-sm">
            <span>{{ copiedToken ? 'Copié !' : 'Copier le code' }}</span>
          </button>
        </div>
      </div>

      <div class="copy-row margin-top-md">
        <span class="copy-row-label">Lien direct d'accès</span>
        <div class="copy-input-group">
          <input type="text" readonly :value="manageUrl" class="copy-input" />
          <button @click="$emit('copy-link')" class="btn btn-secondary copy-btn-sm">
            <span>{{ copiedLink ? 'Copié !' : 'Copier le lien' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- modify helpline card -->
    <div class="modify-notice-box">
      <h4 class="modify-title">Besoin de modifier ?</h4>
      <p class="modify-help">Pour modifier votre réservation, veuillez contacter le restaurant directement :</p>
      <a :href="`tel:${bookingSuccess.restaurant.phone}`" class="btn btn-secondary w-full call-btn">
        <span>📞 Appeler le restaurant ({{ bookingSuccess.restaurant.phone }})</span>
      </a>
    </div>

    <div class="success-actions">
      <NuxtLink to="/" class="btn btn-secondary w-full">Retour à l'accueil</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReservationResponse } from '../../composables/useApi'

defineProps<{
  bookingSuccess: ReservationResponse
  formattedDate: string
  copiedToken: boolean
  copiedLink: boolean
  manageUrl: string
}>()

defineEmits<{
  (e: 'copy-token'): void
  (e: 'copy-link'): void
}>()
</script>

<style scoped>
.success-screen {
  text-align: center;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Badge Stamp */
.badge-stamp {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--primary);
  border-radius: var(--radius-full);
  padding: 12px;
  width: 90px;
  height: 90px;
  margin-bottom: 24px;
  position: relative;
  background: var(--bg-surface-elevated);
}

.stamp-star {
  font-size: 1.4rem;
  color: var(--primary);
  line-height: 1;
}

.stamp-text {
  font-family: var(--font-title);
  font-size: 0.52rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: var(--text-secondary);
  margin-top: 4px;
}

.success-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.success-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

/* Physical Ticket Design */
.ticket-card {
  width: 100%;
  max-width: 440px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 24px;
  position: relative;
}

.ticket-header {
  background: var(--bg-surface-elevated);
  border-bottom: 1.5px dashed var(--border-subtle);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-brand {
  font-family: var(--font-title);
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  color: var(--primary);
}

.ticket-indicator {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--success);
  background: var(--success-glow);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.ticket-body {
  padding: 24px;
}

.ticket-row {
  margin-bottom: 18px;
  text-align: left;
}

.ticket-label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.ticket-value-resto {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
}

.ticket-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 18px;
  text-align: left;
}

.ticket-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.font-gold {
  color: var(--primary) !important;
}

/* Punch line divider mask style */
.ticket-punch-divider {
  position: relative;
  height: 20px;
  margin: 12px -24px 20px -24px;
  display: flex;
  align-items: center;
}

.punch-left, .punch-right {
  position: absolute;
  width: 14px;
  height: 20px;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  top: 0;
  z-index: 2;
}

.punch-left {
  left: -1px;
  border-radius: 0 10px 10px 0;
  border-left-color: transparent;
}

.punch-right {
  right: -1px;
  border-radius: 10px 0 0 10px;
  border-right-color: transparent;
}

.punch-dashed {
  flex-grow: 1;
  border-bottom: 1.5px dashed var(--border-subtle);
  margin: 0 16px;
}

.ticket-code-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.barcode-mock {
  display: flex;
  gap: 2.5px;
  height: 36px;
  align-items: stretch;
  opacity: 0.85;
}

.barcode-mock span {
  background: var(--text-primary);
  width: 2px;
}

.barcode-mock span:nth-child(2n) {
  width: 4px;
}

.barcode-mock span:nth-child(3n) {
  width: 1px;
}

.booking-ref-box {
  text-align: right;
}

.ticket-ref-code {
  font-family: var(--font-title);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
}

/* Copy Panel Cards */
.token-copy-box {
  width: 100%;
  max-width: 440px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
  text-align: left;
}

.copy-panel-title {
  font-size: 0.95rem;
  color: var(--primary);
  margin-bottom: 6px;
}

.token-help {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 20px;
}

.copy-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copy-row-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.copy-input-group {
  display: flex;
  gap: 8px;
  width: 100%;
}

.copy-input {
  flex-grow: 1;
  padding: 10px 12px;
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--text-primary);
}

.copy-btn-sm {
  flex-shrink: 0;
  font-size: 0.8rem !important;
  font-weight: 700 !important;
  padding: 8px 14px !important;
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

/* Modify Notice card */
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

.w-full {
  width: 100%;
}
</style>
