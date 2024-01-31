import type { z } from 'zod'

import type { ThemeSchema, ThemeTypeSchema } from '@/features/theme'

export type ThemeType = z.infer<typeof ThemeTypeSchema>
export type Theme = z.infer<typeof ThemeSchema>

export interface ThemeStoreState {
  theme: Theme
  isDarkPrefered: boolean
}
