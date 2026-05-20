<template>
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
        @click="$emit('select', slot)"
      >
        <span class="slot-time">{{ slot.startTime }}</span>
        <span class="slot-status-indicator" :class="slot.status">
          {{ formatStatusText(slot.status) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SlotResponse } from '../../composables/useApi'

defineProps<{
  slots: SlotResponse[]
  selectedSlot: SlotResponse | null
  pendingSlots: boolean
}>()

defineEmits<{
  (e: 'select', slot: SlotResponse): void
}>()

const formatStatusText = (status: string) => {
  switch (status) {
    case 'free': return 'Disponible'
    case 'nearly_full': return 'Presque plein'
    case 'full': return 'Complet'
    default: return ''
  }
}
</script>

<style scoped>
.slots-wrapper {
  margin-bottom: 28px;
  text-align: left;
}

.form-label {
  display: block;
  font-family: var(--font-title);
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.slot-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-normal);
}

.slot-button:hover:not(:disabled) {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.slot-button.is-selected {
  background: rgba(197, 155, 39, 0.08);
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary);
}

.slot-time {
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.slot-status-indicator {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.slot-status-indicator.free {
  background: var(--success-glow);
  color: var(--success);
}

.slot-status-indicator.nearly_full {
  background: var(--warning-glow);
  color: var(--warning);
}

.slot-status-indicator.full {
  background: var(--error-glow);
  color: var(--error);
}

.slot-button:disabled {
  background: var(--bg-surface-elevated);
  border-color: var(--border-subtle);
  cursor: not-allowed;
  opacity: 0.6;
}

.slots-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  color: var(--text-secondary);
  font-size: 0.9rem;
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
  padding: 16px;
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
}
</style>
