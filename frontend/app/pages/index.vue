<template>
  <div class="home-page container">
    <!-- Hero Section -->
    <section class="hero-section">
      <h1 class="hero-title animate-fade-in">Tables d'Exception</h1>
      <p class="hero-subtitle animate-fade-in">Découvrez et réservez instantanément les meilleures adresses de la gastronomie.</p>
    </section>

    <!-- Filters & Search Bar Panel -->
    <section class="filter-panel glass-panel animate-fade-in">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher un restaurant par nom ou adresse..." 
          class="search-input"
        />
      </div>

      <!-- Cuisine Badges -->
      <div class="cuisines-filter">
        <button 
          class="cuisine-tab" 
          :class="{ active: !selectedCuisine }" 
          @click="selectedCuisine = null"
        >
          Tous les genres
        </button>
        <button 
          v-for="cuisine in cuisines" 
          :key="cuisine"
          class="cuisine-tab"
          :class="{ active: selectedCuisine === cuisine }"
          @click="selectedCuisine = cuisine"
        >
          {{ cuisine }}
        </button>
      </div>
    </section>

    <!-- Content Area -->
    <section class="restaurants-section">
      <!-- Loading State Skeletons -->
      <div v-if="store.isLoading" class="grid-cols-3">
        <div v-for="i in 6" :key="i" class="restaurant-card-skeleton skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-info">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line tag"></div>
            <div class="skeleton-line desc"></div>
            <div class="skeleton-line desc-short"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="error-panel glass-panel">
        <span style="font-size: 2.5rem; margin-bottom: 8px;">⚠️</span>
        <h2>Impossible de charger les restaurants</h2>
        <p>{{ store.error }}</p>
        <button class="btn btn-secondary" @click="store.fetchRestaurants">Réessayer</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredRestaurants.length === 0" class="empty-panel glass-panel">
        <span style="font-size: 2.5rem; margin-bottom: 8px;">🍽️</span>
        <h3>Aucun restaurant trouvé</h3>
        <p>Ajustez votre recherche ou changez de filtre culinaire.</p>
      </div>

      <!-- Restaurants Grid -->
      <div v-else class="grid-cols-3 animate-fade-in">
        <RestaurantCard
          v-for="restaurant in filteredRestaurants"
          :key="restaurant.id"
          :restaurant="restaurant"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRestaurantStore } from '~/stores/restaurantStore'
import RestaurantCard from '~/presentation/components/RestaurantCard.vue'

useHead({
  title: 'Eat and Rest — Accueil',
})

const store = useRestaurantStore()

onMounted(() => {
  store.fetchRestaurants()
})

const searchQuery = ref('')
const selectedCuisine = ref<string | null>(null)

const cuisines = computed(() => {
  return [...new Set(store.restaurants.map(r => r.cuisineType))]
})

const filteredRestaurants = computed(() => {
  return store.restaurants.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCuisine = !selectedCuisine.value || r.cuisineType === selectedCuisine.value

    return matchesSearch && matchesCuisine
  })
})
</script>

<style scoped>
.hero-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1.15rem;
  max-width: 600px;
  margin: 0 auto;
}

.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  margin-bottom: 40px;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 52px;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1.05rem;
  transition: var(--transition-fast);
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.cuisines-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border-top: 1px solid var(--border-subtle);
  padding-top: 20px;
}

.cuisine-tab {
  padding: 8px 16px;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: var(--transition-normal);
}

.cuisine-tab:hover {
  border-color: var(--primary);
  color: var(--text-primary);
}

.cuisine-tab.active {
  background: var(--primary);
  color: var(--bg-base);
  border-color: var(--primary);
  box-shadow: var(--shadow-gold);
}

.empty-panel, .error-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 40px;
  text-align: center;
}

.error-panel h2 {
  color: var(--error);
}

.skeleton-card {
  pointer-events: none;
}

.restaurant-card-skeleton {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skeleton-image {
  background: var(--bg-surface-elevated);
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.skeleton-info {
  padding: 24px;
}

.skeleton-line {
  background: var(--bg-surface-elevated);
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}

.skeleton-line.title {
  width: 70%;
  height: 24px;
}

.skeleton-line.tag {
  width: 40%;
  height: 16px;
}

.skeleton-line.desc {
  width: 100%;
  height: 48px;
}

.skeleton-line.desc-short {
  width: 60%;
  height: 16px;
}

.skeleton-image::after, .skeleton-line::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .filter-panel {
    padding: 16px;
  }
}
</style>
