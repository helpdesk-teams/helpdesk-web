<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="page-header">
    <div>
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <!-- Page-level buttons, e.g. "Новое обращение" -->
    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.page-header__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.page-header__subtitle {
  margin: 4px 0 0;
  color: var(--p-text-muted-color);
}

.page-header__actions {
  display: flex;
  gap: 8px;
}
</style>
