import { PlayerLoader } from '@/features/player'

import { WatchInfoLoader } from './WatchInfo'

export function WatchContentLoader() {
  return (
    <div className='w-full max-w-full flex-1 flex flex-col'>
      <PlayerLoader />
      <WatchInfoLoader />
    </div>
  )
}
