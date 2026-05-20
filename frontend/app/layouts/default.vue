<template>
  <div class="layout-wrapper">
    <!-- Header -->
    <header class="app-header">
      <div class="container header-container">
        <NuxtLink to="/" class="logo-link">
          <span class="logo-text">Eat &amp; Rest</span>
        </NuxtLink>
        <nav class="header-nav">
          <NuxtLink to="/" class="nav-item" active-class="active">Accueil</NuxtLink>
          <NuxtLink to="/manage" class="btn btn-secondary nav-btn">
            <span>Ma Réservation</span>
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Page Content -->
    <main class="app-main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="container footer-container">
        <div class="footer-brand">
          <span class="footer-logo">Eat &amp; Rest</span>
          <p class="footer-description">Découvrez l'excellence culinaire et réservez instantanément votre table d'exception.</p>
        </div>
        <div class="footer-copyright">
          &copy; {{ new Date().getFullYear() }} Eat and Rest.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250, 248, 245, 0.85); /* Frosted Linen Alabaster */
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 16px 0;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-text {
  font-family: var(--font-title);
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.logo-link:hover .logo-text {
  color: var(--primary);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  font-family: var(--font-title);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
  position: relative;
  padding: 4px 0;
}

.nav-item:hover, .nav-item.active {
  color: var(--text-primary);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: var(--transition-normal);
}

.nav-item:hover::after, .nav-item.active::after {
  width: 100%;
}

.nav-btn {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.app-main {
  flex-grow: 1;
  padding: 40px 0;
}

.app-footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  padding: 40px 0;
  margin-top: 60px;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.footer-logo {
  font-family: var(--font-title);
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: block;
}

.footer-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  max-width: 400px;
  margin: 0 auto;
}

.footer-copyright {
  color: var(--text-muted);
  font-size: 0.8rem;
  border-top: 1px solid var(--border-subtle);
  width: 100%;
  padding-top: 20px;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .header-nav {
    gap: 12px;
  }
  .nav-item {
    display: none; /* Hide text nav on mobile for simplicity */
  }
}
</style>
