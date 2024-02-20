import { CheckIcon, CopyIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useCallback, useMemo, useRef, useState } from 'react'

import { convertSeconds, noop } from '@/api'
import { ShareIcon } from '@/assets'
import {
  Button,
  Checkbox,
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

import { selectWatchItemStateTimestamp } from '../../watch.slice'

export interface ShareMenuProps {
  open: boolean
  id: number
  itemTitle: string
  itemLink: string
  title: string
  link: string
  onOpenChange: (open: boolean) => void
}

export function ShareMenu(props: ShareMenuProps) {
  const { open, id, itemTitle, itemLink, title, link, onOpenChange } = props
  const ref = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const timestamp = useAppSelector((state) => selectWatchItemStateTimestamp(state, id))
  const [clicked, setClicked] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [includeTime, setIncludeTime] = useState(false)
  const timestampStr = useMemo(() => convertSeconds(timestamp), [timestamp])
  const Icon = useMemo(
    () => (clicked ? (isSuccess ? CheckIcon : Cross2Icon) : CopyIcon),
    [clicked, isSuccess],
  )
  const finalTitle = useMemo(
    () => (includeTime ? `${title}\n\nTime: ${timestampStr}` : itemTitle),
    [includeTime, itemTitle, title, timestampStr],
  )
  const finalLink = useMemo(
    () => (includeTime ? `${link}&t=${timestamp.toFixed(0)}` : itemLink),
    [includeTime, itemLink, link, timestamp],
  )

  const onIncludeTimeChange = useCallback((value: boolean | 'indeterminate') => {
    if (typeof value !== 'boolean') return
    setIncludeTime(value)
  }, [])

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
    navigator.share({ text: `${finalTitle}\n\n${finalLink}` }).catch(noop)
  }, [finalTitle, finalLink])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className='rounded-full' variant='secondary'>
          <ShareIcon className='mr-2 h-4 w-4' />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            You are going to share: <b>{finalTitle}</b>
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <Checkbox id='terms' checked={includeTime} onCheckedChange={onIncludeTimeChange} />
          <Label htmlFor='terms'>Include time: {timestampStr}</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link' className='sr-only'>
              Link
            </Label>
            <Input ref={ref} readOnly id='link' value={finalLink} />
          </div>
          <Button type='submit' size='sm' className='px-3' onClick={onCopy}>
            <span className='sr-only'>Copy</span>
            <Icon className='h-4 w-4' />
          </Button>
          {!!navigator.share && <Button onClick={onShare}>Share</Button>}
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button variant='secondary'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
