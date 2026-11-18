<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
</script>

<template>
  <section class="not-found">
    <p class="not-found__code">404</p>
    <h1 class="not-found__title">Страница не найдена</h1>
    <p class="not-found__text">Возможно, адрес набран с ошибкой или страница была удалена.</p>
    <RouterLink v-slot="{ navigate }" to="/" custom>
      <Button label="На главную" icon="pi pi-home" @click="navigate" />
    </RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 0;
  text-align: center;
}

.not-found__code {
  margin: 0;
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--p-primary-color);
}

.not-found__title {
  margin: 0;
  font-size: 1.5rem;
}

.not-found__text {
  margin: 0 0 16px;
  color: var(--p-text-muted-color);
}
</style>
