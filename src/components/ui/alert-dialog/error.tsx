import { SerializedError } from '@reduxjs/toolkit'
import { useCallback, useMemo, useState } from 'react'

import { AlertDialogAction } from './action'
import { AlertDialogCancel } from './cancel'
import { AlertDialogContent } from './content'
import { AlertDialog } from './core'
import { AlertDialogDescription } from './description'
import { AlertDialogFooter } from './footer'
import { AlertDialogHeader } from './header'
import { AlertDialogTitle } from './title'

export interface AlertErrorDialogProps {
  title?: string
  description?: string
  open?: boolean
  error?: SerializedError | null
  dissmisable?: boolean
  onClose?: () => void
  onReload: () => void
}

export function AlertErrorDialog(props: AlertErrorDialogProps) {
  const { title, description, open, error, dissmisable, onClose, onReload } = props
  const [closed, setClosed] = useState(false)
  const isOpen = useMemo(() => open && !closed, [open, closed])

  const closeHandler = useCallback(() => {
    setClosed(true)
    onClose?.()
  }, [onClose])

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || 'Oops!'}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className='mb-2 block'>{description || 'Following error occured:'}</span>
            <span className='block relative rounded font-mono text-sm font-semibold text-destructive'>
              {`[${error?.name ?? 'Unknown Error'}]: `}
              {error?.message ?? 'Something went wrong'}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {dissmisable && <AlertDialogCancel onClick={closeHandler}>Close</AlertDialogCancel>}
          <AlertDialogAction onClick={onReload}>Reload</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
