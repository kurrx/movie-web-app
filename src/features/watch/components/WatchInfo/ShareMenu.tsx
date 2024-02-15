import { CheckIcon, CopyIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useCallback, useMemo, useRef, useState } from 'react'

import { noop } from '@/api'
import { ShareIcon } from '@/assets'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@/components'
import { useAppSelector } from '@/hooks'

import {
  selectWatchItem,
  selectWatchItemFullTitle,
  selectWatchItemStateEpisode,
  selectWatchItemStateSeason,
  selectWatchItemStateTimestamp,
  selectWatchItemStateTranslatorId,
} from '../../watch.slice'

export function ShareMenu({ id }: { id: number }) {
  const ref = useRef<HTMLInputElement>(null)
  const item = useAppSelector((state) => selectWatchItem(state, id))
  const translatorId = useAppSelector((state) => selectWatchItemStateTranslatorId(state, id))
  const season = useAppSelector((state) => selectWatchItemStateSeason(state, id))
  const episode = useAppSelector((state) => selectWatchItemStateEpisode(state, id))
  const timestamp = useAppSelector((state) => selectWatchItemStateTimestamp(state, id))
  const title = useAppSelector((state) => selectWatchItemFullTitle(state, id))
  const link = useMemo(() => {
    const root = `${window.location.origin}/share`
    const itemPath = `${item.typeId}/${item.genreId}/${item.slug}`
    let query = `tr=${translatorId}&t=${timestamp.toFixed(0)}`
    if (typeof season === 'number' && typeof episode === 'number') {
      query += `&s=${season}&e=${episode}`
    }
    return `${root}/${itemPath}?${query}`
  }, [item, translatorId, season, episode, timestamp])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [clicked, setClicked] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const Icon = useMemo(
    () => (clicked ? (isSuccess ? CheckIcon : Cross2Icon) : CopyIcon),
    [clicked, isSuccess],
  )

  const onCopy = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (!ref.current) return
    ref.current.select()
    const isSuccess = document.execCommand('copy')
    setClicked(true)
    setIsSuccess(isSuccess)
    timeoutRef.current = setTimeout(() => {
      setClicked(false)
    }, 2000)
  }, [])

  const onShare = useCallback(() => {
    if (!navigator.share) return
    navigator.share({ text: `${title}\n\n${link}` }).catch(noop)
  }, [title, link])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='rounded-full' variant='secondary'>
          <ShareIcon className='mr-2 h-4 w-4' />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>Send your experience to your friends.</DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link' className='sr-only'>
              Link
            </Label>
            <Input ref={ref} readOnly id='link' defaultValue={link} />
          </div>
          <Button type='submit' size='sm' className='px-3' onClick={onCopy}>
            <span className='sr-only'>Copy</span>
            <Icon className='h-4 w-4' />
          </Button>
          {!!navigator.share && <Button onClick={onShare}>Share</Button>}
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
