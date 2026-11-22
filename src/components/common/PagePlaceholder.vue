<script setup lang="ts">
// Temporary stub content for pages that are not built yet.
// Delete it once every page is implemented.
import { useI18n } from 'vue-i18n'
import Message from 'primevue/message'

const { t } = useI18n()

defineProps<{
  /** Development stage where the real page will be built */
  stage: number
}>()
</script>

<template>
  <Message severity="secondary" icon="pi pi-wrench">
    {{ t('common.comingAtStage', { stage }) }}
  </Message>
</template>
