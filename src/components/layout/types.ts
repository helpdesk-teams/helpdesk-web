import type { RouteLocationRaw } from 'vue-router'

/** One link in the header navigation */
export interface NavItem {
  label: string
  icon: string
  to: RouteLocationRaw
}
