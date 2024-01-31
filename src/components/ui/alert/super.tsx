import { InfoCircledIcon } from '@radix-ui/react-icons'
import { forwardRef, HTMLAttributes } from 'react'

import { Button, ButtonProps } from '../button'
import { AlertContent } from './content'
import { Alert } from './core'
import { AlertDescription } from './description'
import { AlertTitle } from './title'

type Ref = HTMLDivElement
type RefProps = Omit<HTMLAttributes<Ref>, 'onClick'>

export interface AlertSuperProps extends RefProps {
  title?: string
  variant?: 'default' | 'destructive'
  buttonText?: string
  onClick?: ButtonProps['onClick']
}

export const AlertSuper = forwardRef<Ref, AlertSuperProps>(function AlertSuper(props, ref) {
  const {
    title = 'Error',
    variant = 'default',
    buttonText = 'Click',
    onClick,
    children,
    ...restProps
  } = props

  return (
    <Alert ref={ref} variant={variant} {...restProps}>
      <InfoCircledIcon className='h-4 w-4' />
      <AlertContent>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </AlertContent>
      <Button variant={variant} onClick={onClick}>
        {buttonText}
      </Button>
    </Alert>
  )
})
