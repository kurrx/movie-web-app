import { animate, motion, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { clamp, cn } from '@/api'
import { StarIcon } from '@/assets'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Skeleton,
} from '@/components'

interface RateProps {
  rating: number | null
  big?: boolean
  active?: boolean
}

function Rate({ rating, big, active }: RateProps) {
  const color = useMemo(() => {
    if (active) return '#FFFFFF'
    if (!big || rating === null) return 'var(--primary)'
    if (rating >= 7) return '#3BB33B'
    if (rating >= 5) return '#777777'
    return '#FF0200'
  }, [big, rating, active])
  const opacity = useMemo(() => (rating === null && big ? 0.5 : 1), [rating, big])

  return (
    <div
      className={cn(
        'w-20 h-20 font-black text-4xl shrink-0',
        'pointer-events-none select-none',
        'flex items-center justify-center',
        big ? 'text-5xl' : 'text-4xl',
      )}
      style={{ color, opacity }}
    >
      {rating === null ? <div className='w-[0.75em] h-[0.1em] bg-[currentColor]' /> : rating}
    </div>
  )
}

export interface RateMenuProps {
  title: string
  subtitle?: string
  posterUrl: string
  rating?: number | null
  onRateChange: (rating: number | null) => void
}

const valueFromX = (x: number) => Math.round(Math.abs(clamp(x, -800, 0)) / 80) || null

export function RateMenu(props: RateMenuProps) {
  const { title, subtitle, posterUrl, rating, onRateChange } = props
  const x = useMotionValue(0)
  const prevX = useRef(0)
  const isStickyAnimation = useRef(false)
  const isDragging = useRef(false)
  const [open, setOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [sliderRating, setSliderRating] = useState<number | null>(rating || null)
  const getColorFromRating = useCallback((rating: number | null) => {
    if (rating === null) return 'light-gray'
    if (rating >= 7) return 'green'
    if (rating >= 5) return 'gray'
    return 'red'
  }, [])
  const triggerColor = useMemo(
    () => getColorFromRating(rating || null),
    [getColorFromRating, rating],
  )
  const color = useMemo(() => getColorFromRating(sliderRating), [getColorFromRating, sliderRating])
  const text = useMemo(() => {
    if (!rating) {
      if (!sliderRating) return 'Close'
      return 'Rate'
    }
    if (!sliderRating) return 'Remove Rating'
    return rating === sliderRating ? 'Share' : 'Update Rating'
  }, [sliderRating, rating])
  const activeHovered = useMemo(() => {
    if (!rating) return false
    if (!sliderRating) return false
    return rating === sliderRating
  }, [rating, sliderRating])

  const handleChange = useCallback(() => {
    onRateChange(sliderRating)
    setOpen(false)
  }, [sliderRating, onRateChange])

  useMotionValueEvent(x, 'change', (newX) => {
    const prevValue = valueFromX(prevX.current)
    const value = valueFromX(newX)
    prevX.current = newX
    if (prevValue === value) return
    setSliderRating(value)
  })

  useMotionValueEvent(x, 'animationComplete', () => {
    if (isStickyAnimation.current || isDragging.current) return
    const next = (valueFromX(x.get()) || 0) * -80
    animate(x, next, {
      autoplay: true,
      ease: 'easeOut',
      duration: 0.3,
    })
  })

  const onDrag = useCallback(() => {
    isDragging.current = true
  }, [])

  const onDragEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  useEffect(() => {
    setSliderRating(rating || null)
    x.set((rating || 0) * -80)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'relative rounded-full transition-colors',
            triggerColor !== 'light-gray' && 'shadow-sm text-white flex font-bold',
            triggerColor !== 'light-gray' && 'hover:[&>*:last-child]:bg-black/10',
            triggerColor !== 'light-gray' && 'items-center justify-center [&>svg]:fill-white',
            triggerColor === 'green' && 'bg-[#3BB33B] hover:bg-[#35A135]',
            triggerColor === 'gray' && 'bg-[#777777] hover:bg-[#6B6B6B]',
            triggerColor === 'red' && 'bg-[#FF0200] hover:bg-[#E60200]',
          )}
          variant={triggerColor === 'light-gray' ? 'secondary' : 'custom'}
        >
          <StarIcon className='mr-2 h-5 w-5' />
          {!rating ? 'Rate' : rating}
          <span className='absolute top-0 left-0 w-full h-full rounded-full bg-black/0 transition-colors' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md !px-0' onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='text-center'>Rate</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col items-center justify-center'>
          <div className='relative w-[7rem] rounded-lg overflow-hidden'>
            <div className='pb-[150%]' />
            <Skeleton
              className={cn(
                'absolute w-full h-full top-0 left-0',
                !imageLoaded ? 'block' : 'hidden',
              )}
            />
            <img
              src={posterUrl}
              alt={title}
              className={cn(
                'absolute w-full h-full top-0 left-0 object-cover',
                !imageLoaded ? 'hidden' : 'inline-block',
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div className='text-center font-bold text px-4 mt-1'>{title}</div>
          {subtitle && (
            <div className='text-center text-muted-foreground font-medium px-4 text-xs'>
              {subtitle}
            </div>
          )}
          <div className='relative w-full my-[1.625rem] h-[6.25rem] py-2.5 overflow-hidden'>
            <motion.div
              drag='x'
              dragConstraints={{ left: -800, right: 0 }}
              whileTap={{ cursor: 'grabbing' }}
              style={{ x }}
              className={cn(
                'absolute top-2.5 left-0 px-[calc(50%-2.5rem)]',
                'flex items-center justify-center hover:cursor-grab',
              )}
              onDrag={onDrag}
              onDragStart={onDrag}
              onDragEnd={onDragEnd}
            >
              <Rate rating={null} />
              {Array.from({ length: 10 }).map((_, i) => (
                <Rate key={i + 1} rating={i + 1} />
              ))}
            </motion.div>
            <div
              className={cn(
                'absolute w-[6.25rem] h-[6.25rem] top-[50%] left-[50%]',
                'translate-x-[-50%] translate-y-[-50%] rounded-full py-2.5',
                'overflow-hidden pointer-events-none select-none transition-colors',
                !activeHovered && 'bg-secondary',
                activeHovered && triggerColor === 'green' && 'bg-[#3BB33B] hover:bg-[#35A135]',
                activeHovered && triggerColor === 'gray' && 'bg-[#777777] hover:bg-[#6B6B6B]',
                activeHovered && triggerColor === 'red' && 'bg-[#FF0200] hover:bg-[#E60200]',
              )}
            >
              <motion.div className='flex items-center justify-center w-[56.25rem]' style={{ x }}>
                <Rate big rating={null} />
                {Array.from({ length: 10 }).map((_, i) => (
                  <Rate key={i + 1} big rating={i + 1} active={rating === i + 1} />
                ))}
              </motion.div>
            </div>
          </div>
          <Button
            className={cn(
              'w-[15rem] relative rounded-full transition-colors font-bold',
              'hover:[&>*:last-child]:bg-black/10',
              color !== 'light-gray' && 'shadow-sm text-white flex',
              color !== 'light-gray' && 'items-center justify-center',
              color === 'green' && 'bg-[#3BB33B] hover:bg-[#35A135]',
              color === 'gray' && 'bg-[#777777] hover:bg-[#6B6B6B]',
              color === 'red' && 'bg-[#FF0200] hover:bg-[#E60200]',
            )}
            variant={color === 'light-gray' ? 'secondary' : 'custom'}
            onClick={handleChange}
          >
            {text}
            <span className='absolute top-0 left-0 w-full h-full rounded-full bg-black/0 transition-colors' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
