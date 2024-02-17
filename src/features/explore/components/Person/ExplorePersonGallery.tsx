import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useCallback, useMemo, useState } from 'react'

import { cn, notEmpty, wrap } from '@/api'
import { LoaderIcon } from '@/assets'
import { Button, Skeleton } from '@/components'
import { ExplorePerson } from '@/types'

function NavButton({ dir, onClick }: { dir: 'left' | 'right'; onClick?: () => void }) {
  return (
    <Button
      size='icon'
      variant='outline'
      className={cn(
        'z-[2] absolute top-[50%] translate-y-[-50%]',
        dir === 'left' ? 'left-0 translate-x-[-50%]' : 'right-0 translate-x-[50%]',
        'rounded-full h-8 w-8',
      )}
      onClick={onClick}
    >
      {dir === 'left' ? (
        <ChevronLeftIcon className='h-5 w-5' />
      ) : (
        <ChevronRightIcon className='h-5 w-5' />
      )}
    </Button>
  )
}

export function ExplorePersonGallery({ person }: { person: ExplorePerson }) {
  const [[page, direction], setPage] = useState([0, 0])
  const [imageLoaded, setImageLoaded] = useState(false)
  const gallery = useMemo(() => [person.photoUrl, ...person.gallery].filter(notEmpty), [person])
  const imageIndex = useMemo(() => wrap(0, gallery.length, page), [gallery, page])

  const paginate = useCallback(
    (dir: number) => {
      setPage([page + dir, dir])
      setImageLoaded(false)
    },
    [page],
  )

  return (
    <div className='relative w-full flex items-center justify-center'>
      <div className='relative sm:w-[15rem] w-[12rem] border rounded-xl'>
        <div className='pb-[150%]' />
        {gallery.length === 0 && (
          <Skeleton className='absolute w-full h-full left-0 top-0 rounded-xl' />
        )}
        {gallery.length > 0 && (
          <div className='absolute w-full h-full left-0 top-0 rounded-xl overflow-hidden'>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                className='absolute w-full h-full left-0 top-0 rounded-xl overflow-hidden'
                custom={direction}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? '100%' : '-100%',
                    opacity: 0,
                  }),
                  center: {
                    zIndex: 1,
                    x: 0,
                    opacity: 1,
                  },
                  exit: (direction: number) => ({
                    zIndex: 0,
                    x: direction < 0 ? '100%' : '-100%',
                    opacity: 0,
                  }),
                }}
                initial='enter'
                animate='center'
                exit='exit'
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag={gallery.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x
                  if (swipe < -10000) {
                    paginate(1)
                  } else if (swipe > 10000) {
                    paginate(-1)
                  }
                }}
              >
                <Skeleton className='absolute w-full h-full left-0 top-0' />
                <LoaderIcon className='w-6 h-6 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]' />
                <img
                  src={gallery[imageIndex]}
                  alt={`${person.name} ${imageIndex + 1}`}
                  className={cn(
                    'absolute w-full h-full left-0 top-0',
                    'object-cover select-none pointer-events-none',
                    imageLoaded ? 'opacity-100' : 'opacity-0',
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        {gallery.length > 1 && (
          <Fragment>
            <NavButton dir='left' onClick={() => paginate(-1)} />
            <NavButton dir='right' onClick={() => paginate(1)} />
          </Fragment>
        )}
      </div>
    </div>
  )
}
