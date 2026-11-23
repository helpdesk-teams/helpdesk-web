<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { NavItem } from './types'

// Same list of links for the header (horizontal) and the mobile menu (vertical)
defineProps<{
  items: NavItem[]
  vertical?: boolean
}>()

const emit = defineEmits<{
  navigate: []
}>()

const { t } = useI18n()
</script>

<template>
  <nav
    class="nav-links"
    :class="{ 'nav-links--vertical': vertical }"
    :aria-label="t('layout.mainNavigation')"
  >
    <RouterLink
      v-for="item in items"
      :key="item.label"
      :to="item.to"
      class="nav-links__link"
      active-class="nav-links__link--active"
      @click="emit('navigate')"
    >
      <i :class="item.icon" aria-hidden="true" />
      {{ item.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.nav-links {
  display: flex;
  gap: 4px;
}

.nav-links--vertical {
  flex-direction: column;
}

.nav-links__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--p-border-radius-md);
  color: var(--p-text-muted-color);
  text-decoration: none;
  white-space: nowrap;
}

.nav-links--vertical .nav-links__link {
  padding: 10px 12px;
}

.nav-links__link:hover {
  background: var(--p-content-hover-background);
  color: var(--p-text-color);
}

.nav-links__link--active {
  background: var(--p-highlight-background);
  color: var(--p-highlight-color);
}
</style>
