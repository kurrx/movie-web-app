import { SerializedError } from '@reduxjs/toolkit'
import { Fragment, PropsWithChildren, ReactNode } from 'react'

import { AlertErrorDialog } from '@/components'
import { FetchState } from '@/core'

import { ErrorView } from './ErrorView'
import { LoadingView } from './LoadingView'

export interface FallbackViewProps extends PropsWithChildren {
  state: FetchState
  customLoadingView?: ReactNode
  text?: string
  error?: SerializedError | null
  dismissible?: boolean
  onReload?: () => void
  onClose?: () => void
}

export function FallbackView(props: FallbackViewProps) {
  const { state, text, customLoadingView, error, dismissible, children, onReload, onClose } = props

  if (state === FetchState.LOADING) {
    if (customLoadingView) {
      return customLoadingView
    }
    return <LoadingView text={text} />
  }

  if (state === FetchState.ERROR) {
    return (
      <Fragment>
        <ErrorView title={error?.name} subtitle={error?.message} />
        <AlertErrorDialog
          error={error}
          dismissible={dismissible}
          onReload={onReload}
          onClose={onClose}
        />
      </Fragment>
    )
  }

  return children
}
