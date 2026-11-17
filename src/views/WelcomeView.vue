<script setup lang="ts">
// Temporary page for stage 0: proves that PrimeVue and the constants work.
// It will be replaced by real routes at stage 1.
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import { TICKET_STATUSES, TICKET_STATUS_META } from '@/utils/constants'
</script>

<template>
  <Card>
    <template #title>Каркас проекта готов</template>
    <template #content>
      <p>Статусы обращений из <code>utils/constants</code>:</p>
      <div class="tags">
        <Tag
          v-for="status in TICKET_STATUSES"
          :key="status"
          :value="TICKET_STATUS_META[status].label"
          :severity="TICKET_STATUS_META[status].severity"
          :icon="TICKET_STATUS_META[status].icon"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
