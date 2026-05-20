<template>
  <NuxtLink :to="`/restaurants/${restaurant.id}`" class="restaurant-card glass-panel">
    <div class="image-wrapper">
      <img :src="restaurant.imageUrl" :alt="restaurant.name" class="restaurant-image" />
      <div class="cuisine-badge">{{ restaurant.cuisineType }}</div>
    </div>
    <div class="restaurant-info">
      <h2 class="restaurant-name">{{ restaurant.name }}</h2>
      <div class="restaurant-address">
        <span class="address-icon">📍</span>
        <span>{{ restaurant.address }}</span>
      </div>
      <p class="restaurant-desc">{{ restaurant.description }}</p>
      <div class="card-footer">
        <span class="view-details">Voir la carte &amp; réserver</span>
        <span class="arrow-icon">➔</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Restaurant } from '../../composables/useApi'

defineProps<{
  restaurant: Restaurant
}>()
</script>

<style scoped>
.restaurant-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  transition: var(--transition-normal);
  background: var(--bg-surface);
}

.restaurant-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary);
  box-shadow: var(--shadow-gold);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.restaurant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-slow);
}

.restaurant-card:hover .restaurant-image {
  transform: scale(1.08);
}

.cuisine-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(250, 248, 245, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.restaurant-info {
  display: flex;
  flex-direction: column;
  padding: 24px;
  flex-grow: 1;
}

.restaurant-name {
  font-size: 1.4rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.restaurant-address {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.restaurant-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 24px;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-subtle);
  padding-top: 16px;
}

.view-details {
  font-family: var(--font-title);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--primary);
}

.arrow-icon {
  color: var(--primary);
  transition: var(--transition-fast);
}

.restaurant-card:hover .arrow-icon {
  transform: translateX(4px);
}
</style>
