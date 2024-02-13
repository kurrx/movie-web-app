/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Fragment, PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/api'
import { explore } from '@/features/router'
import { useElementRect } from '@/hooks'

interface LinkProps extends PropsWithChildren {
  to: string
  clickable: boolean
}

function Link({ to, children, clickable }: LinkProps) {
  return (
    <NavLink
      className={cn(
        'text-primary underline-offset-4 hover:underline',
        'data-[clickable=false]:pointer-events-none font-medium',
      )}
      to={to}
      data-clickable={clickable}
    >
      #{children}
    </NavLink>
  )
}

export interface WatchInfoDescriptionProps extends PropsWithChildren {
  typeId: string
  genreIds: string[]
  year?: number | null
  country?: string | null
}

export function WatchInfoDescription(props: WatchInfoDescriptionProps) {
  const { children, typeId, genreIds, year, country } = props
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
    <section
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
        <span className='flex items-center justify-start flex-wrap gap-x-4 gap-y-2 mt-2'>
          <Link to={`/explore/${typeId}`} clickable={!expandable || expanded}>
            {explore[typeId].title}
          </Link>
          {genreIds.map((genreId) => (
            <Link
              key={genreId}
              to={`/explore/${typeId}/${genreId}`}
              clickable={!expandable || expanded}
            >
              {explore[typeId].genres[genreId]}
            </Link>
          ))}
          {year && (
            <Link to={`/explore/year/${year}`} clickable={!expandable || expanded}>
              {year}
            </Link>
          )}
          {country && (
            <Link to={`/explore/country/${country}`} clickable={!expandable || expanded}>
              {country}
            </Link>
          )}
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
    </section>
  )
}
