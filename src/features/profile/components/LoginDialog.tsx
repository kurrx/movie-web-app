import { PersonIcon } from '@radix-ui/react-icons'
import { NavLink } from 'react-router-dom'

import { GoogleLogoIcon } from '@/assets'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components'
import { useStore, useStoreBoolean } from '@/hooks'

import { selectProfileLoginDialog, setProfileLoginDialog } from '../profile.slice'

export function LoginDialog() {
  const [dispatch, selector] = useStore()
  const open = selector(selectProfileLoginDialog)
  const { set: onOpenChange } = useStoreBoolean(setProfileLoginDialog)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <div className='w-full space-y-6'>
          <Button variant='outline' className='w-full'>
            <GoogleLogoIcon className='mr-2 h-4 w-4' />
            Google
          </Button>
          <p className='px-8 text-center text-sm text-muted-foreground'>
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
