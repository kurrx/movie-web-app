import { useMemo } from 'react'

import { cn } from '@/api'
import { KinopoiskLogoIcon, LeafIcon } from '@/assets'
import { Button } from '@/components'
import { ItemRating } from '@/types'

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

export function KinopoiskButton({ rating }: { rating: ItemRating }) {
  const fixed = useMemo(() => parseFloat(rating.rate.toFixed(1)), [rating])
  const color = useMemo(() => {
    if (fixed >= 8.2) return 'gold'
    if (fixed > 7) return 'green'
    if (fixed > 5) return 'gray'
    return 'red'
  }, [fixed])

  return (
    <Button
      asChild
      className={cn(
        'relative rounded-full hover:[&>*:last-child]:bg-black/10',
        'flex items-center justify-center font-bold shadow-sm',
        color === 'green' && 'bg-[#3BB33B] hover:bg-[#35A135]',
        color === 'gray' && 'bg-[#777777] hover:bg-[#6B6B6B]',
        color === 'red' && 'bg-[#FF0200] hover:bg-[#E60200]',
        color === 'gold' ? 'text-black' : 'text-white',
      )}
      style={{
        backgroundImage:
          color === 'gold' ? 'linear-gradient(160deg, #EACC7F 16%, #AD9C72 64%)' : undefined,
      }}
      variant='custom'
    >
      <a href={rating.link} target='_blank' rel='noreferrer'>
        <KinopoiskLogoIcon className='mr-2 h-4 w-4' />
        <span className='flex items-center justify-center space-x-0.5'>
          {color === 'gold' && <LeafIcon className='w-2 h-4' />}
          <span>{fixed.toFixed(1)}</span>
          {color === 'gold' && <LeafIcon className='w-2 h-4' style={{ transform: 'scaleX(-1)' }} />}
        </span>
        <span className='opacity-50 font-normal text-[0.6rem] leading-[0.6rem] ml-1'>
          ({formatter.format(rating.votes)})
        </span>
        <span className='absolute top-0 left-0 w-full h-full rounded-full bg-black/0 transition-colors' />
      </a>
    </Button>
  )
}
