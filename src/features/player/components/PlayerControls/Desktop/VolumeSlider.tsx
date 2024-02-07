import { Range, Root, Thumb, Track } from '@radix-ui/react-slider'
import { motion } from 'framer-motion'
import { FocusEvent, useCallback, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { cn } from '@/api'
import { VolumeModerateIcon, VolumeMutedIcon, VolumeNormalIcon } from '@/assets'
import { selectDeviceIsTouch } from '@/features/device'
import { useStore } from '@/hooks'

import {
  selectPlayerMuted,
  selectPlayerVolume,
  setPlayerMuted,
  setPlayerMutedWithAction,
  setPlayerVolume,
  setPlayerVolumeWithAction,
} from '../../../player.slice'
import { PlayerTooltip } from '../PlayerTooltip'
import { Button } from './Buttons/Button'

export function VolumeSlider() {
  const [dispatch, selector] = useStore()
  const isTouch = selector(selectDeviceIsTouch)
  const muted = selector(selectPlayerMuted)
  const volume = selector(selectPlayerVolume)
  const [hovered, setHovered] = useState(false)
  const [moving, setMoving] = useState(false)
  const timeout = useRef<NodeJS.Timeout | null>(null)
  const visible = useMemo(() => hovered || isTouch, [hovered, isTouch])
  const id = useMemo(() => {
    if (volume === 0 || muted) return 'volume-off'
    if (volume < 50) return 'volume-moderate'
    return 'volume-normal'
  }, [volume, muted])
  const Icon = useMemo(() => {
    switch (id) {
      case 'volume-off':
        return VolumeMutedIcon
      case 'volume-moderate':
        return VolumeModerateIcon
      case 'volume-normal':
        return VolumeNormalIcon
    }
  }, [id])
  const tooltip = useMemo(() => (muted ? 'Unmute' : 'Mute'), [muted])

  const toggleMuted = useCallback(
    (withAction: boolean) => {
      if (withAction) {
        dispatch(setPlayerMutedWithAction((prev) => !prev))
      } else {
        dispatch(setPlayerMuted((prev) => !prev))
      }
    },
    [dispatch],
  )
  const changeVolume = useCallback(
    (e: KeyboardEvent, multi: number) => {
      if (document.activeElement !== document.body) return
      dispatch(setPlayerVolumeWithAction((prev) => prev + 5 * multi))
      e.preventDefault()
    },
    [dispatch],
  )

  const onButtonClick = useCallback(() => toggleMuted(false), [toggleMuted])
  const onMuteKeyClick = useCallback(() => toggleMuted(true), [toggleMuted])
  const onUpKeyClick = useCallback((e: KeyboardEvent) => changeVolume(e, 1), [changeVolume])
  const onDownKeyClick = useCallback((e: KeyboardEvent) => changeVolume(e, -1), [changeVolume])
  const onVolumeChange = useCallback(
    ([value]: number[]) => {
      dispatch(setPlayerVolume(value))
      setMoving(true)
    },
    [dispatch],
  )

  const onHoverStart = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
    setHovered(true)
  }, [])
  const onHoverEnd = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
    timeout.current = setTimeout(() => {
      setHovered(false)
    }, 3000)
  }, [])
  const onPointerDown = useCallback(() => {
    setMoving(true)
  }, [])
  const onPointerUp = useCallback(() => {
    setMoving(false)
  }, [])
  const onFocus = useCallback((e: FocusEvent) => {
    const target = e.target
    if (target instanceof HTMLElement) {
      target.blur()
    }
  }, [])

  useHotkeys('m', onMuteKeyClick, [onMuteKeyClick])
  useHotkeys('up', onUpKeyClick, [onUpKeyClick])
  useHotkeys('down', onDownKeyClick, [onDownKeyClick])

  return (
    <motion.div
      className='flex items-center justify-center h-full'
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <Button id={id} tooltip={tooltip} tooltipHotkey='M' onClick={onButtonClick}>
        <Icon className='!w-9 !h-9' />
      </Button>
      <PlayerTooltip content='Volume' disabled={!visible || moving}>
        <motion.div
          className='dark self-stretch flex items-center justify-start'
          variants={{
            visible: { width: 'auto' },
            hidden: { width: 0 },
          }}
          transition={{ duration: 0.2, ease: [0.4, 0, 1, 1] }}
          animate={visible ? 'visible' : 'hidden'}
          style={{ overflow: 'hidden' }}
        >
          <Root
            className={cn(
              'relative flex w-full touch-none',
              'select-none items-center w-[3.625rem]',
              'mx-1 shrink-0 cursor-pointer',
              'self-stretch h-full',
            )}
            min={0}
            max={100}
            step={1}
            value={[!muted ? volume : 0]}
            onValueChange={onVolumeChange}
            onPointerDownCapture={onPointerDown}
            onPointerUpCapture={onPointerUp}
          >
            <Track className={cn('relative h-full self-stretch w-full grow overflow-hidden')}>
              <Range className='absolute rounded-sm h-1 top-[calc(50%-2px)] left-0 bg-primary' />
              <span className='absolute w-full rounded-sm h-1 top-[calc(50%-2px)] left-0 bg-primary/20' />
            </Track>
            <Thumb
              className={cn(
                'block h-3 w-3 rounded-full',
                'bg-primary transition-colors',
                'focus-visible:outline-none',
                'focus-visible:ring-1',
                'focus-visible:ring-ring',
                'disabled:pointer-events-none',
                'disabled:opacity-50',
              )}
              onFocus={onFocus}
            />
          </Root>
        </motion.div>
      </PlayerTooltip>
    </motion.div>
  )
}
