<script setup lang="ts">
// Temporary stub content for pages that are not built yet.
// Delete it once every page is implemented.
import Message from 'primevue/message'

defineProps<{
  /** Development stage where the real page will be built */
  stage: number
}>()
</script>

<template>
  <Message severity="secondary" icon="pi pi-wrench">
    Страница появится на этапе {{ stage }}.
  </Message>
</template>
