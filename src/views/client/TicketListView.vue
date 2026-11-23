<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'
import { ROUTE_NAMES } from '@/router/types'

const { t } = useI18n()
</script>

<template>
  <PageHeader :title="t('pages.clientTickets')">
    <template #actions>
      <!-- `custom` + slot: RouterLink gives navigate(), PrimeVue Button renders the look -->
      <RouterLink v-slot="{ navigate }" :to="{ name: ROUTE_NAMES.clientTicketNew }" custom>
        <Button :label="t('tickets.newTicket')" icon="pi pi-plus" @click="navigate" />
      </RouterLink>
    </template>
  </PageHeader>
  <PagePlaceholder :stage="4" />
</template>
