<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import OverlayBadge from 'primevue/overlaybadge'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import AppNavLinks from './AppNavLinks.vue'
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

const { t } = useI18n()

// Open/closed state of the mobile menu matters only inside the header,
// so it is a local ref, not a store.
const isMenuOpen = ref(false)
</script>

<template>
  <header class="app-header">
    <!-- Visible only on narrow screens (see the media query below) -->
    <Button
      class="app-header__menu-button"
      icon="pi pi-bars"
      text
      rounded
      severity="secondary"
      :aria-label="t('layout.openMenu')"
      :aria-expanded="isMenuOpen"
      @click="isMenuOpen = true"
    />

    <RouterLink to="/" class="app-header__logo">
      <i class="pi pi-headphones" aria-hidden="true" />
      <span>{{ t('app.name') }}</span>
    </RouterLink>

    <AppNavLinks :items="navItems" class="app-header__nav" />

    <div class="app-header__actions">
      <LocaleSwitcher class="app-header__locale" />

      <!-- The badge is shown only when there is something unread -->
      <OverlayBadge v-if="unreadCount > 0" :value="unreadCount" severity="danger">
        <Button
          icon="pi pi-bell"
          text
          rounded
          :aria-label="t('layout.notificationsUnread', { count: unreadCount })"
          @click="emit('openNotifications')"
        />
      </OverlayBadge>
      <Button
        v-else
        icon="pi pi-bell"
        text
        rounded
        :aria-label="t('layout.notifications')"
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
        :aria-label="t('layout.logout')"
        @click="emit('logout')"
      />
    </div>

    <!-- Mobile menu: slides in from the left -->
    <Drawer v-model:visible="isMenuOpen" :header="t('app.name')">
      <AppNavLinks :items="navItems" vertical @navigate="isMenuOpen = false" />
      <template #footer>
        <div class="app-header__drawer-footer">
          <span class="app-header__drawer-user">
            <i class="pi pi-user" aria-hidden="true" />
            {{ userName }}
          </span>
          <LocaleSwitcher />
        </div>
      </template>
    </Drawer>
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
  flex: 1;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.app-header__user,
.app-header__drawer-user {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.app-header__user {
  padding: 0 8px;
}

.app-header__drawer-user {
  color: var(--p-text-muted-color);
}

.app-header__drawer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.app-header__locale {
  margin-right: 8px;
}

/* The menu button exists only on narrow screens */
.app-header__menu-button {
  display: none;
}

/* Narrow screens: links and the user name move into the drawer */
@media (max-width: 767px) {
  .app-header {
    gap: 8px;
    padding: 0 8px;
  }

  .app-header__menu-button {
    display: inline-flex;
  }

  /* On a phone the language switch lives in the mobile menu */
  .app-header__nav,
  .app-header__user,
  .app-header__locale {
    display: none;
  }
}
</style>
