<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <span class="app-logo">
        <i class="pi pi-headphones" aria-hidden="true" />
        Smart Helpdesk
      </span>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: var(--p-content-background);
  border-bottom: 1px solid var(--p-content-border-color);
}

.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--p-primary-color);
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
