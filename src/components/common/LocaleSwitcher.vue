<script setup lang="ts">
import { computed, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectButton from 'primevue/selectbutton'
import { SUPPORTED_LOCALES, setLocale, type AppLocale } from '@/i18n'

// RU / EN toggle. Used in the header, the mobile menu and on the login page.
const { t, locale } = useI18n()

// A unique id for aria-labelledby, so several switchers on one page don't clash
const labelId = useId()

const options = SUPPORTED_LOCALES.map((code) => ({ code, short: code.toUpperCase() }))

// v-model on the current language: reading shows it, writing switches it
const current = computed({
  get: () => locale.value as AppLocale,
  set: (code: AppLocale) => setLocale(code),
})
</script>

<template>
  <div class="locale-switcher">
    <span :id="labelId" class="visually-hidden">{{ t('locale.switchLabel') }}</span>
    <SelectButton
      v-model="current"
      :options="options"
      option-label="short"
      option-value="code"
      :allow-empty="false"
      :aria-labelledby="labelId"
      size="small"
    >
      <!-- Short code on the button, full language name for screen readers -->
      <template #option="{ option }">
        <span :lang="option.code" :title="t(`locale.${option.code}`)">{{ option.short }}</span>
      </template>
    </SelectButton>
  </div>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
