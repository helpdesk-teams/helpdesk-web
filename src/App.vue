<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import type { LayoutName } from '@/router/types'

const layouts = {
  default: DefaultLayout,
  auth: AuthLayout,
} satisfies Record<LayoutName, unknown>

const route = useRoute()

// Until the first navigation finishes, route.matched is empty.
// Rendering nothing then avoids a flash of the wrong layout (e.g. header on /login).
const layout = computed(() =>
  route.matched.length > 0 ? layouts[route.meta.layout ?? 'default'] : null,
)
</script>

<template>
  <component :is="layout" v-if="layout">
    <RouterView />
  </component>
</template>
