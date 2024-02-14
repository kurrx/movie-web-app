/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Fragment, PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/api'
import { useElementRect } from '@/hooks'

export interface DescriptionProps extends PropsWithChildren {
  links: { to: string; title: string }[]
}

export function Description(props: DescriptionProps) {
  const { children, links } = props
  const ref = useRef<HTMLParagraphElement>(null)
  const { height } = useElementRect(ref)
  const expandable = useMemo(() => height > 80, [height])
  const [expanded, setExpanded] = useState(false)

  const expand = useCallback(() => {
    if (!expandable || expanded) return
    setExpanded(true)
  }, [expandable, expanded])

  const collapse = useCallback(() => {
    if (!expandable || !expanded) return
    setExpanded(false)
  }, [expandable, expanded])

  return (
    <div
      className={cn(
        'bg-secondary py-3 px-4 rounded-xl max-h-[7rem]',
        'data-[clickable=true]:cursor-pointer overflow-y-hidden',
        'data-[clickable=true]:select-none relative',
        'data-[expanded=true]:max-h-[none]',
      )}
      data-clickable={expandable && !expanded}
      data-expanded={!expandable || expanded}
      onClick={expand}
    >
      <h3 className='font-bold text-md mb-2'>Description</h3>
      <p ref={ref} className='text-sm'>
        {children}
        <span className='flex items-center justify-start flex-wrap gap-x-2 gap-y-2 mt-2'>
          {links.map(({ to, title }, index) => (
            <NavLink
              key={index}
              className={cn(
                'text-primary underline-offset-4 hover:underline',
                'data-[clickable=false]:pointer-events-none font-medium',
              )}
              to={to}
              data-clickable={!expandable || expanded}
            >
              #{title}
            </NavLink>
          ))}
        </span>
        {expandable && expanded && (
          <Fragment>
            <br />
            <button className='font-bold text-sm' onClick={collapse}>
              Show less
            </button>
          </Fragment>
        )}
      </p>
      <div
        className={cn(
          'absolute w-full h-2 left-0 bottom-0',
          'data-[visible=false]:hidden bg-secondary',
          'select-none pointer-events-none',
        )}
        data-visible={expandable && !expanded}
      />
      <button
        className={cn(
          'absolute right-0 bottom-2 font-bold',
          'data-[visible=false]:hidden text-sm',
          'select-none pointer-events-none',
          'bg-secondary pr-7',
        )}
        style={{ boxShadow: '-20px 0px 7px 3px hsl(var(--secondary))' }}
        data-visible={expandable && !expanded}
      >
        ...more
      </button>
    </div>
  )
}
