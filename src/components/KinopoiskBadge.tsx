import { useMemo } from 'react'

import { cn } from '@/api'
import { LeafIcon } from '@/assets'

export interface KinopoiskBadgeProps {
  rating: number | null
}

export function KinopoiskBadge({ rating }: KinopoiskBadgeProps) {
  const fixed = useMemo(() => rating?.toFixed(1), [rating])
  const color = useMemo(() => {
    if (!fixed) return null
    const fixedFloat = parseFloat(fixed)
    if (fixedFloat >= 8.2) return 'gold'
    if (fixedFloat > 7) return '#3BB33B'
    if (fixedFloat > 5) return '#777777'
    return '#FF0200'
  }, [fixed])

  if (!fixed || !color) return null

  if (color === 'gold')
    return (
      <span
        className={cn(
          'text-black h-[1.1rem] w-[2.5rem]',
          'flex items-center justify-center shrink-0',
          'font-bold text-[0.6rem] rounded-md space-x-0.5',
        )}
        style={{ backgroundImage: 'linear-gradient(160deg,#eacc7f 16%,#ad9c72 64%)' }}
      >
        <LeafIcon className='w-[0.375rem] h-[0.75rem]' />
        <span>{fixed}</span>
        <LeafIcon className='w-[0.375rem] h-[0.75rem]' style={{ transform: 'scaleX(-1)' }} />
      </span>
    )

  return (
    <span
      className={cn(
        'text-white h-[1.1rem] w-[2.5rem]',
        'flex items-center justify-center shrink-0',
        'font-bold text-[0.6rem] rounded-md',
      )}
      style={{ backgroundColor: color }}
    >
      {fixed}
    </span>
  )
}
