<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import OverlayBadge from 'primevue/overlaybadge'
import type { NavItem } from './types'

// The header only displays data and reports clicks.
// Where the user name or the unread count come from is decided by the layout.
defineProps<{
  navItems: NavItem[]
  userName: string
  unreadCount: number
}>()

const emit = defineEmits<{
  logout: []
  openNotifications: []
}>()
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="app-header__logo">
      <i class="pi pi-headphones" aria-hidden="true" />
      <span>Smart Helpdesk</span>
    </RouterLink>

    <nav class="app-header__nav" aria-label="Основная навигация">
      <RouterLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        class="app-header__link"
        active-class="app-header__link--active"
      >
        <i :class="item.icon" aria-hidden="true" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="app-header__actions">
      <!-- The badge is shown only when there is something unread -->
      <OverlayBadge v-if="unreadCount > 0" :value="unreadCount" severity="danger">
        <Button
          icon="pi pi-bell"
          text
          rounded
          :aria-label="`Уведомления: ${unreadCount} непрочитанных`"
          @click="emit('openNotifications')"
        />
      </OverlayBadge>
      <Button
        v-else
        icon="pi pi-bell"
        text
        rounded
        aria-label="Уведомления"
        @click="emit('openNotifications')"
      />

      <span class="app-header__user">
        <i class="pi pi-user" aria-hidden="true" />
        {{ userName }}
      </span>

      <Button
        icon="pi pi-sign-out"
        text
        rounded
        severity="secondary"
        aria-label="Выйти"
        @click="emit('logout')"
      />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 56px;
  padding: 0 16px;
  background: var(--p-content-background);
  border-bottom: 1px solid var(--p-content-border-color);
}

.app-header__logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--p-primary-color);
  text-decoration: none;
  white-space: nowrap;
}

.app-header__nav {
  display: flex;
  gap: 4px;
  flex: 1;
}

.app-header__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--p-border-radius-md);
  color: var(--p-text-muted-color);
  text-decoration: none;
  white-space: nowrap;
}

.app-header__link:hover {
  background: var(--p-content-hover-background);
  color: var(--p-text-color);
}

.app-header__link--active {
  background: var(--p-highlight-background);
  color: var(--p-highlight-color);
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.app-header__user {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  white-space: nowrap;
}
</style>
