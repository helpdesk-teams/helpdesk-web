<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'

const { t } = useI18n()
</script>

<template>
  <PageHeader :title="t('pages.login')" />
  <PagePlaceholder :stage="3" />
</template>
