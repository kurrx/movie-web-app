import { useCallback, useEffect, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { GoogleLogoIcon, LoaderIcon } from '@/assets'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components'
import { useStore, useStoreBoolean } from '@/hooks'

import {
  login,
  selectProfileDialog,
  selectProfileError,
  selectProfileLoading,
  setProfileDialog,
} from '../profile.slice'

export function LoginDialog() {
  const [dispatch, selector] = useStore()
  const location = useLocation()
  const open = selector(selectProfileDialog)
  const loading = selector(selectProfileLoading)
  const error = selector(selectProfileError)
  const { set: onOpenChange, setFalse: close } = useStoreBoolean(setProfileDialog)
  const Icon = useMemo(() => (loading ? LoaderIcon : GoogleLogoIcon), [loading])
  const text = useMemo(() => (loading ? 'Loading...' : 'Google'), [loading])

  const onLogin = useCallback(() => {
    dispatch(login())
  }, [dispatch])

  useEffect(() => {
    close()
  }, [close, location])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:w-[500px]'>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Create an account or login to existing one to continue watching
          </DialogDescription>
        </DialogHeader>
        <div className='w-full'>
          <Button variant='outline' className='w-full' onClick={onLogin}>
            <Icon className='mr-2 h-4 w-4' />
            {text}
          </Button>
          {error && (
            <p className='mt-4 text-sm text-destructive'>
              {error.message
                ? error.message.includes('admin-restricted-operation')
                  ? 'Admin restricted sign-ups'
                  : error.message
                : 'Something went wrong'}
            </p>
          )}
          <p className='px-8 mt-6 text-center text-sm text-muted-foreground'>
            By clicking continue, you agree with{' '}
            <NavLink to='/policy' className='underline underline-offset-4 hover:text-primary'>
              policy
            </NavLink>{' '}
            of this application
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
