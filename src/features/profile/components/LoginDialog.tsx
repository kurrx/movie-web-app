import { PersonIcon } from '@radix-ui/react-icons'
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
  DialogTrigger,
} from '@/components'
import { LoginState } from '@/core'
import { useStore, useStoreBoolean } from '@/hooks'

import {
  selectProfileIsLoggedIn,
  selectProfileLoginDialog,
  selectProfileLoginState,
  setProfileLoginDialog,
  signIn,
} from '../profile.slice'

export function LoginDialog() {
  const [dispatch, selector] = useStore()
  const location = useLocation()
  const open = selector(selectProfileLoginDialog)
  const isLoggedIn = selector(selectProfileIsLoggedIn)
  const { state, error } = selector(selectProfileLoginState)
  const { set: onOpenChange, setFalse: close } = useStoreBoolean(setProfileLoginDialog)
  const Icon = useMemo(() => {
    switch (state) {
      case LoginState.LOADING:
        return LoaderIcon
      default:
        return GoogleLogoIcon
    }
  }, [state])
  const text = useMemo(() => {
    switch (state) {
      case LoginState.LOADING:
        return 'Loading...'
      default:
        return 'Google'
    }
  }, [state])

  const onLogin = useCallback(() => {
    dispatch(signIn())
  }, [dispatch])

  useEffect(() => {
    close()
  }, [close, location])

  return (
    <Dialog open={open && !isLoggedIn} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <PersonIcon />
        </Button>
      </DialogTrigger>
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
          {state === LoginState.ERROR && error && (
            <p className='mt-4 text-sm text-destructive'>
              {error.message || 'Something went wrong'}
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
