import { useCallback, useEffect, useRef } from 'react'
import { isIOS, isIPad13, isMobileOnly, isMobileSafari } from 'react-device-detect'
import { OnProgressProps } from 'react-player/base'
import ReactPlayer from 'react-player/file'

import { useStore, useStoreBoolean } from '@/hooks'

import { useFullscreen, usePlayerSubtitles } from '../hooks'
import {
  resetPlayerState,
  selectPlayerDuration,
  selectPlayerMuted,
  selectPlayerPip,
  selectPlayerPlaybackSpeedCombined,
  selectPlayerPlayingCombined,
  selectPlayerVolume,
  setPlayerBuffering,
  setPlayerDuration,
  setPlayerEnded,
  setPlayerLoadedProgress,
  setPlayerPip,
  setPlayerPlaybackSpeed,
  setPlayerPlaying,
  setPlayerProgress,
  setPlayerReady,
} from '../player.slice'
import { useNodes } from './PlayerNodes'
import { useProps } from './PlayerProps'

export function PlayerNative() {
  const [dispatch, selector] = useStore()
  const { setPlayer, player } = useNodes()
  const { mediaUrl, startTime, subtitles, onTimeUpdate, onPreloadNext } = useProps()
  const { exitFullscreen } = useFullscreen()
  const playing = selector(selectPlayerPlayingCombined)
  const volume = selector(selectPlayerVolume)
  const muted = selector(selectPlayerMuted)
  const playbackSpeed = selector(selectPlayerPlaybackSpeedCombined)
  const pip = selector(selectPlayerPip)
  const duration = selector(selectPlayerDuration)
  const thresholdPassed = useRef(false)

  const onReady = useCallback(() => {
    dispatch(setPlayerReady())
    player?.seekTo(startTime, 'seconds')
  }, [dispatch, player, startTime])

  const onDuration = useCallback(
    (duration: number) => {
      dispatch(setPlayerDuration(duration))
    },
    [dispatch],
  )

  const onBuffer = useCallback(() => {
    dispatch(setPlayerBuffering(true))
  }, [dispatch])

  const onBufferEnd = useCallback(() => {
    dispatch(setPlayerBuffering(false))
  }, [dispatch])

  const onPlay = useCallback(() => {
    dispatch(setPlayerPlaying(true))
  }, [dispatch])

  const onPause = useCallback(() => {
    dispatch(setPlayerPlaying(false))
  }, [dispatch])

  const onProgress = useCallback(
    (progress: OnProgressProps) => {
      dispatch(setPlayerProgress(progress.playedSeconds))
      dispatch(setPlayerLoadedProgress(progress.loadedSeconds))
      onTimeUpdate(progress.playedSeconds, duration)
      if (progress.played >= 0.75 && !thresholdPassed.current) {
        thresholdPassed.current = true
        onPreloadNext()
      }
    },
    [dispatch, onTimeUpdate, onPreloadNext, duration],
  )

  const onSeek = useCallback(
    (seconds: number) => {
      dispatch(setPlayerProgress(seconds))
    },
    [dispatch],
  )

  const onPlaybackRateChange = useCallback(
    (rate: number) => {
      dispatch(setPlayerPlaybackSpeed(rate))
    },
    [dispatch],
  )

  const { setTrue: onEnablePIP, setFalse: onDisablePIP } = useStoreBoolean(setPlayerPip)

  const onEnded = useCallback(() => {
    dispatch(setPlayerEnded())
    if (isIOS && (isMobileOnly || isMobileSafari) && !isIPad13) {
      exitFullscreen()
    }
  }, [dispatch, exitFullscreen])

  useEffect(() => {
    return () => {
      thresholdPassed.current = false
      dispatch(resetPlayerState())
    }
  }, [dispatch])

  usePlayerSubtitles()

  return (
    <div className='player-wrapper'>
      <ReactPlayer
        ref={setPlayer}
        className='player'
        width='100%'
        height='100%'
        url={mediaUrl}
        controls={false}
        playsinline={true}
        loop={false}
        stopOnUnmount={false}
        config={{
          attributes: {
            crossOrigin: 'anonymous',
          },
          forceHLS: true,
          forceSafariHLS: true,
          hlsVersion: '1.5.4',
          hlsOptions: {
            maxBufferLength: 180,
            maxBufferSize: 33554432000,
            maxMaxBufferLength: 600,
          },
          tracks: subtitles,
        }}
        playing={playing}
        volume={volume / 100}
        muted={muted}
        playbackRate={playbackSpeed}
        progressInterval={1000 / playbackSpeed}
        pip={pip}
        onReady={onReady}
        onDuration={onDuration}
        onBuffer={onBuffer}
        onBufferEnd={onBufferEnd}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
        onSeek={onSeek}
        onPlaybackRateChange={onPlaybackRateChange}
        onEnablePIP={onEnablePIP}
        onDisablePIP={onDisablePIP}
        onError={(err) => {
          console.log('error', err)
        }}
        onEnded={onEnded}
      />
    </div>
  )
}
