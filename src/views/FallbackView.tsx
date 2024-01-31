import { SerializedError } from '@reduxjs/toolkit'
import { PropsWithChildren } from 'react'

import { AlertErrorDialog } from '@/components'
import { FetchState } from '@/core'

import { ErrorView } from './ErrorView'
import { LoadingView } from './LoadingView'

export interface FallbackViewProps extends PropsWithChildren {
  state: FetchState
  text?: string
  error?: SerializedError | null
  dismissible?: boolean
  onReload?: () => void
  onClose?: () => void
}

export function FallbackView(props: FallbackViewProps) {
  const { state, text, error, dismissible, children, onReload, onClose } = props

  if (state === FetchState.LOADING) {
    return <LoadingView text={text} />
  }

  if (state === FetchState.ERROR) {
    return (
      <>
        <ErrorView title={error?.name} subtitle={error?.message} />
        <AlertErrorDialog
          error={error}
          dismissible={dismissible}
          onReload={onReload}
          onClose={onClose}
        />
      </>
    )
  }

  return children
}
