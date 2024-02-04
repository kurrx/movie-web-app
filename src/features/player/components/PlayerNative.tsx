import { useCallback, useEffect } from 'react'
import { OnProgressProps } from 'react-player/base'
import ReactPlayer from 'react-player/file'

import { useStore } from '@/hooks'

import {
  resetPlayerState,
  selectPlayerMuted,
  selectPlayerPlaybackSpeed,
  selectPlayerPlaying,
  selectPlayerVolume,
  setPlayerBuffering,
  setPlayerDuration,
  setPlayerEnded,
  setPlayerLoaded,
  setPlayerPlaying,
  setPlayerProgress,
  setPlayerReady,
} from '../player.slice'
import { useNodes } from './PlayerNodes'
import { useProps } from './PlayerProps'

export function PlayerNative() {
  const [dispatch, selector] = useStore()
  const { setPlayer, player } = useNodes()
  const { mediaUrl, startTime, onTimeUpdate } = useProps()
  const playing = selector(selectPlayerPlaying)
  const volume = selector(selectPlayerVolume)
  const muted = selector(selectPlayerMuted)
  const playbackSpeed = selector(selectPlayerPlaybackSpeed)

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
      dispatch(setPlayerLoaded(progress.loadedSeconds))
      onTimeUpdate(progress.playedSeconds)
    },
    [dispatch, onTimeUpdate],
  )

  const onSeek = useCallback(
    (seconds: number) => {
      dispatch(setPlayerProgress(seconds))
    },
    [dispatch],
  )

  const onEnded = useCallback(() => {
    dispatch(setPlayerEnded())
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(resetPlayerState())
    }
  }, [dispatch])

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
          forceHLS: true,
          forceSafariHLS: true,
          hlsVersion: '1.4.10',
        }}
        playing={playing}
        volume={volume / 100}
        muted={muted}
        playbackRate={playbackSpeed}
        progressInterval={1000 / playbackSpeed}
        onReady={onReady}
        onDuration={onDuration}
        onBuffer={onBuffer}
        onBufferEnd={onBufferEnd}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
        onSeek={onSeek}
        onEnded={onEnded}
      />
    </div>
  )
}
