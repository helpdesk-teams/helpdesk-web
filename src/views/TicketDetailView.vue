<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'

// Shared by the client (/tickets/:id) and the operator (/operator/tickets/:id).
// The operator version will additionally show the AI panel (stage 5).
// `id` comes from the route thanks to `props: true` in routes.ts.
defineProps<{
  id: string
}>()
</script>

<template>
  <PageHeader title="Обращение" :subtitle="`ID: ${id}`" />
  <PagePlaceholder :stage="4" />
</template>
