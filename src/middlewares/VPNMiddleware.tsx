import { SerializedError } from '@reduxjs/toolkit'
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'

import { fetchIsVPNActive } from '@/api'
import { FetchState } from '@/core'
import { FallbackView } from '@/views'

export function VPNMiddleware({ children }: PropsWithChildren) {
  const [state, setState] = useState<FetchState>(FetchState.LOADING)
  const [error, setError] = useState<SerializedError | null>(null)
  const controller = useRef<AbortController | null>(null)

  const validate = useCallback(() => {
    controller.current?.abort()

    setState(FetchState.LOADING)
    setError(null)
    controller.current = new AbortController()

    fetchIsVPNActive({ signal: controller.current.signal })
      .then(() => {
        setState(FetchState.SUCCESS)
      })
      .catch((err) => {
        if (err.code === 'CANCELLED') return

        setError(err)
        setState(FetchState.ERROR)
      })
      .finally(() => {
        controller.current = null
      })

    return () => {
      controller.current?.abort()
    }
  }, [])

  const onClose = useCallback(() => {
    setState(FetchState.SUCCESS)
    setError(null)
    controller.current = null
  }, [])

  useEffect(validate, [validate])

  return (
    <FallbackView
      state={state}
      text='Validating VPN Connection...'
      dismissible={error?.code === 'VPN_NOT_CONNECTED'}
      error={error}
      onReload={validate}
      onClose={onClose}
    >
      {children}
    </FallbackView>
  )
}
