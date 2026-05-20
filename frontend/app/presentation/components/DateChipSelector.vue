<template>
  <div class="date-selector-wrapper">
    <label class="form-label">1. Choisissez une date</label>
    <div class="date-chips">
      <button 
        v-for="date in dates" 
        :key="date.key" 
        class="date-chip" 
        :class="{ active: selectedDate === date.key }"
        @click="$emit('select', date.key)"
      >
        {{ date.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  dates: Array<{ key: string, label: string }>
  selectedDate: string
}>()

defineEmits<{
  (e: 'select', dateKey: string): void
}>()
</script>

<style scoped>
.date-selector-wrapper {
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

.date-chips {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.date-chip {
  flex-shrink: 0;
  padding: 10px 18px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: var(--transition-normal);
}

.date-chip:hover {
  border-color: var(--primary);
  color: var(--text-primary);
}

.date-chip.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
  box-shadow: var(--shadow-gold);
}
</style>
