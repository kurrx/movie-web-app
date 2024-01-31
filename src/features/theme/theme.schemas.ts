import { z } from 'zod'

export const ThemeTypeSchema = z.enum(['light', 'dark'])

export const DefaultThemeSchema = z.literal('system')

export const ThemeSchema = z
  .union([ThemeTypeSchema, DefaultThemeSchema])
  .catch(DefaultThemeSchema.value)
