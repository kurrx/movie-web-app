import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { useCallback, useState } from 'react'

import { db, SOCIAL_PORTFOLIO_URL } from '@/api'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components'

export function IssuesMenu({ id }: { id: number }) {
  const [cleanLoading, setCleanLoading] = useState(false)

  const reload = useCallback(() => {
    window.location.reload()
  }, [])

  const clearCache = useCallback(async () => {
    try {
      setCleanLoading(true)
      await db.cleanById(id)
    } finally {
      reload()
    }
  }, [id, reload])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='rounded-full' variant='secondary'>
          <QuestionMarkCircledIcon className='mr-2 h-4 w-4' />
          Issues
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Troubleshoot Issuse</DialogTitle>
        </DialogHeader>
        <div className='text-sm space-y-2'>
          <p className='leading-5'>
            Sometimes the video may stop due to fatal errors that are beyond my control. To fix
            these errors, do the following:
          </p>
          <div className='space-y-1'>
            <ul className='ml-6 list-disc [&>li]:mt-1'>
              <li>
                Make sure your <b>Internet Connection</b> is stable.
              </li>
              <li>
                In most cases, simply reloading the page helps fix errors. To do this, click
                the&nbsp;
                <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
                  Reload
                </code>{' '}
                button.
              </li>
              <li>Try to change quality of video.</li>
              <li>
                If reloading and quality changing does not help solve the issue, try clearing the
                cache. To do this, click the&nbsp;
                <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
                  Clear Cache
                </code>{' '}
                button.
              </li>
              <li>If all of the above does not solve the issue, please contact me directly.</li>
            </ul>
          </div>
          <p className='leading-5'>
            All up-to-date contact methods can be found on my personal portfolio website:
          </p>
        </div>
        <DialogFooter className='flex-col sm:space-y-0 space-y-2'>
          <Button asChild variant='secondary'>
            <a href={SOCIAL_PORTFOLIO_URL} target='_blank' rel='noreferrer'>
              kurr.dev
            </a>
          </Button>
          <Button variant='secondary' onClick={clearCache}>
            {cleanLoading ? 'Clearing...' : 'Clear Cache'}
          </Button>
          <Button variant='secondary' onClick={reload}>
            Reload
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
