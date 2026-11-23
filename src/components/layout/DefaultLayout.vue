<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from './AppHeader.vue'
import type { NavItem } from './types'
import { ROUTE_NAMES } from '@/router/types'

// Temporary data until the stores exist:
// - user name and logout → auth store (stage 3)
// - unread count → notifications store (stage 6)
// - nav items will depend on the user's role (stage 3)
const { t } = useI18n()

// computed: the labels are re-translated when the language changes
const navItems = computed<NavItem[]>(() => [
  { label: t('layout.myTickets'), icon: 'pi pi-inbox', to: { name: ROUTE_NAMES.clientTickets } },
  { label: t('layout.queue'), icon: 'pi pi-list', to: { name: ROUTE_NAMES.operatorQueue } },
])
const userName = computed(() => t('layout.guest'))
const unreadCount = 0

function handleLogout() {
  // Will call authStore.logout() at stage 3
}

function handleOpenNotifications() {
  // Will open the notifications panel at stage 6
}
</script>

<template>
  <div class="default-layout">
    <AppHeader
      :nav-items="navItems"
      :user-name="userName"
      :unread-count="unreadCount"
      @logout="handleLogout"
      @open-notifications="handleOpenNotifications"
    />
    <main class="default-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.default-layout__main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
