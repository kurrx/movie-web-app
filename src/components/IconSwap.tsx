import { AnimatePresence, motion } from 'framer-motion'
import { PropsWithChildren } from 'react'

export interface IconSwapProps extends PropsWithChildren {
  id: string
}

export function IconSwap({ id, children }: IconSwapProps) {
  return (
    <span className='relative pointer-events-none'>
      <AnimatePresence mode='sync' initial={false}>
        <motion.span
          key={id}
          className='absolute top-[50%] left-[50%]'
          tabIndex={-1}
          variants={{
            center: { x: '-50%', y: '-50%' },
            visible: { opacity: 1, scale: 1 },
            hidden: { opacity: 0, scale: 0.7 },
          }}
          initial={['center', 'hidden']}
          animate={['center', 'visible']}
          exit={['center', 'hidden']}
          whileTap={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
