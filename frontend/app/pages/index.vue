<template>
  <div class="home-page container">
    <!-- Hero Section -->
    <section class="hero-section">
      <h1 class="hero-title animate-fade-in">✦ Tables d'Exception</h1>
      <p class="hero-subtitle animate-fade-in">Découvrez et réservez instantanément les meilleures adresses de la gastronomie.</p>
    </section>

    <!-- Filters & Search Bar Panel -->
    <section class="filter-panel glass-panel animate-fade-in">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
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
      <div v-if="pending" class="grid-cols-3">
        <div v-for="i in 6" :key="i" class="restaurant-card skeleton-card">
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
      <div v-else-if="error" class="error-panel glass-panel">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="var(--error)" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>Impossible de charger les restaurants</h2>
        <p>Le serveur de l'API est hors ligne ou inaccessible. Veuillez vérifier que votre backend est bien actif.</p>
        <button class="btn btn-secondary" @click="refresh">Réessayer</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredRestaurants.length === 0" class="empty-panel glass-panel">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="var(--text-secondary)" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h3>Aucun restaurant trouvé</h3>
        <p>Ajustez votre recherche ou changez de filtre culinaire.</p>
      </div>

      <!-- Restaurants Grid -->
      <div v-else class="grid-cols-3 animate-fade-in">
        <NuxtLink 
          v-for="restaurant in filteredRestaurants" 
          :key="restaurant.id" 
          :to="`/restaurants/${restaurant.id}`" 
          class="restaurant-card glass-panel"
        >
          <div class="image-wrapper">
            <img :src="restaurant.imageUrl" :alt="restaurant.name" class="restaurant-image" />
            <div class="cuisine-badge">{{ restaurant.cuisineType }}</div>
          </div>
          <div class="restaurant-info">
            <h2 class="restaurant-name">{{ restaurant.name }}</h2>
            <div class="restaurant-address">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{{ restaurant.address }}</span>
            </div>
            <p class="restaurant-desc">{{ restaurant.description }}</p>
            <div class="card-footer">
              <span class="view-details">Voir la carte &amp; réserver</span>
              <span class="arrow-icon">➔</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

// SEO Meta
useHead({
  title: 'Eat and Rest — Accueil',
})

const { getRestaurants } = useApi()

// Fetch restaurants
const { data: restaurants, pending, error, refresh } = await useAsyncData(
  'restaurants',
  () => getRestaurants()
)

// Search & Filter State
const searchQuery = ref('')
const selectedCuisine = ref<string | null>(null)

// Unique list of cuisines derived from backend data
const cuisines = computed(() => {
  if (!restaurants.value) return []
  return [...new Set(restaurants.value.map(r => r.cuisineType))]
})

// Filter logic
const filteredRestaurants = computed(() => {
  if (!restaurants.value) return []
  return restaurants.value.filter(r => {
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

/* Filter panel styles */
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

/* Restaurant Card styles */
.restaurant-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  transition: var(--transition-normal);
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
  background: rgba(6, 9, 14, 0.75);
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

/* Empty, Error and Skeleton panels */
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

/* Skeletons */
.skeleton-card {
  pointer-events: none;
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
    rgba(255, 255, 255, 0) 100-percent
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
