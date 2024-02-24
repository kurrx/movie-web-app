import { IMDbLogoIcon } from '@/assets'
import { Button } from '@/components'
import { ItemRating } from '@/types'

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

export function IMDbButton({ rating }: { rating: ItemRating }) {
  return (
    <Button
      asChild
      className='rounded-full font-bold bg-[#F5C617] hover:bg-[#E7B80A] text-black'
      variant='secondary'
    >
      <a href={rating.link} target='_blank' rel='noreferrer'>
        <IMDbLogoIcon className='mr-2 h-4 w-8' />
        {rating.rate.toFixed(1)}
        <span className='opacity-50 font-normal text-[0.6rem] leading-[0.6rem] ml-1'>
          ({formatter.format(rating.votes)})
        </span>
      </a>
    </Button>
  )
}
