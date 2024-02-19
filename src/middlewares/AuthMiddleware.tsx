import { PropsWithChildren } from 'react'

import { GoogleLogoIcon } from '@/assets'
import { Button } from '@/components'
import { selectProfileIsLoggedIn, selectProfileLoading, setProfileDialog } from '@/features'
import { useAppSelector, useStoreBoolean } from '@/hooks'
import { LoadingView } from '@/views'

export function AuthMiddleware({ children }: PropsWithChildren) {
  const isLoggedIn = useAppSelector(selectProfileIsLoggedIn)
  const loading = useAppSelector(selectProfileLoading)
  const { setTrue: openLoginDialog } = useStoreBoolean(setProfileDialog)

  if (isLoggedIn) {
    return children
  }

  if (loading) {
    return <LoadingView text='Logging In...' />
  }

  return (
    <div className='flex-1 flex flex-col items-center justify-center'>
      <h1 className='font-bold text-3xl'>Access Denied</h1>
      <p className='text-muted-foreground text-center'>You need to login to access this page.</p>
      <Button className='sm:w-[20rem] w-[15rem] mt-4' onClick={openLoginDialog}>
        <GoogleLogoIcon className='w-4 h-4 mr-2' />
        Login
      </Button>
    </div>
  )
}
