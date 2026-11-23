<script setup lang="ts">
// Frame for /login and /register: no header, the form is centered on the screen.
import { useI18n } from 'vue-i18n'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'

const { t } = useI18n()
</script>

<template>
  <div class="auth-layout">
    <!-- The language can be chosen before signing in -->
    <LocaleSwitcher class="auth-layout__locale" />
    <div class="auth-layout__logo">
      <i class="pi pi-headphones" aria-hidden="true" />
      <span>{{ t('app.name') }}</span>
    </div>
    <main class="auth-layout__card">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px 16px;
}

.auth-layout__locale {
  position: absolute;
  top: 16px;
  right: 16px;
}

.auth-layout__logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.5rem;
  color: var(--p-primary-color);
}

.auth-layout__card {
  width: 100%;
  max-width: 420px;
  padding: 32px 24px;
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-border-radius-xl);
}
</style>
