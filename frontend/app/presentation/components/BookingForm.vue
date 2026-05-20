<template>
  <div class="booking-form-box border-top-subtle">
    <h3 class="form-section-title">3. Vos coordonnées</h3>
    
    <div v-if="generalError" class="form-error general-form-error animate-fade-in">
      <span>⚠️</span>
      <span>{{ generalError }}</span>
    </div>

    <form @submit.prevent="submitForm">
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
        Réservation le <strong>{{ formattedDate }}</strong> à <strong>{{ startTime }}</strong> pour <strong>{{ bookingForm.covers }} couverts</strong>.
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  apiErrors: Record<string, string>
  generalError: string | null
  isSubmitting: boolean
  formattedDate: string
  startTime: string
}>()

const emit = defineEmits<{
  (e: 'submit', form: { covers: number, customerName: string, customerEmail: string, customerPhone: string }): void
}>()

const bookingForm = ref({
  covers: 2,
  customerName: '',
  customerEmail: '',
  customerPhone: ''
})

const submitForm = () => {
  emit('submit', { ...bookingForm.value })
}
</script>

<style scoped>
.booking-form-box {
  padding-top: 24px;
}

.border-top-subtle {
  border-top: 1px solid var(--border-subtle);
}

.form-section-title {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: var(--text-primary);
  text-align: left;
}

.form-group {
  margin-bottom: 18px;
  text-align: left;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.form-control {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: var(--transition-fast);
}

.form-control:focus {
  border-color: var(--primary);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.form-control.is-invalid {
  border-color: var(--error);
  background: rgba(194, 65, 12, 0.02);
}

.form-error {
  color: var(--error);
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 6px;
  text-align: left;
}

.general-form-error {
  background: var(--error-glow);
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(194, 65, 12, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.summary-notice {
  padding: 14px;
  background: rgba(197, 155, 39, 0.04);
  border-color: rgba(197, 155, 39, 0.15);
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
  text-align: left;
}

.w-full {
  width: 100%;
}
</style>
