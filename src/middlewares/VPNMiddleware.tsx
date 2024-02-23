import { PropsWithChildren, useCallback, useEffect } from 'react'

import { dismissVpnError, selectDeviceVpn, validateVpn } from '@/features'
import { useStore } from '@/hooks'
import { FallbackView } from '@/views'

export function VPNMiddleware({ children }: PropsWithChildren) {
  const [dispatch, selector] = useStore()
  const { state, error } = selector(selectDeviceVpn)

  const validate = useCallback(() => {
    const signal = dispatch(validateVpn())
    return () => {
      signal.abort()
    }
  }, [dispatch])

  const onClose = useCallback(() => {
    dispatch(dismissVpnError())
  }, [dispatch])

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
