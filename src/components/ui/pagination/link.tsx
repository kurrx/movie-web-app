import { ComponentProps, ElementRef, forwardRef, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { cn } from '@/api'

import { ButtonProps, buttonVariants } from '../button'

type Component = typeof NavLink
type Ref = ElementRef<Component>
type RefProps = ComponentProps<Component>
type ButtonSizeProps = Pick<ButtonProps, 'size'>

export interface PaginationLinkProps extends RefProps, ButtonSizeProps {}

export const PaginationLink = forwardRef<Ref, PaginationLinkProps>(
  function PaginationLink(props, ref) {
    const { className, size = 'icon', to, ...restProps } = props
    const location = useLocation()
    const isActive = useMemo(() => location.pathname + location.search === to, [location, to])

    return (
      <NavLink
        ref={ref}
        to={to}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          buttonVariants({
            variant: isActive ? 'outline' : 'ghost',
            size,
          }),
          className,
        )}
        {...restProps}
      ></NavLink>
    )
  },
)
