import { z } from 'zod'

const defaultSettings = {
  theater: false,
  autoPlay: false,
  volume: 100,
  muted: false,
  playbackSpeed: 1,
  jumpStep: 10,
}

export const PlayerSettings = z
  .object({
    theater: z.boolean().catch(defaultSettings.theater),
    autoPlay: z.boolean().catch(defaultSettings.autoPlay),
    volume: z.number().min(0).max(100).int().catch(defaultSettings.volume),
    muted: z.boolean().catch(defaultSettings.muted),
    playbackSpeed: z.number().min(0.25).max(2).catch(defaultSettings.playbackSpeed),
    jumpStep: z.number().positive().catch(defaultSettings.jumpStep),
  })
  .catch({
    theater: defaultSettings.theater,
    autoPlay: defaultSettings.autoPlay,
    volume: defaultSettings.volume,
    muted: defaultSettings.muted,
    playbackSpeed: defaultSettings.playbackSpeed,
    jumpStep: defaultSettings.jumpStep,
  })

export function getPlayerSettings() {
  const item = localStorage.getItem('player-settings')
  if (!item) return defaultSettings
  try {
    return PlayerSettings.parse(JSON.parse(item))
  } catch {
    return defaultSettings
  }
}

export function savePlayerSettings(settings: z.infer<typeof PlayerSettings>) {
  const clone = JSON.parse(JSON.stringify(settings))
  localStorage.setItem('player-settings', JSON.stringify(clone))
}
