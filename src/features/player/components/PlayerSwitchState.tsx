import { cn } from '@/api'
import { LoaderIcon } from '@/assets'
import { AlertErrorDialog } from '@/components'
import { SwitchState } from '@/core'

import { useNodes } from './PlayerNodes'
import { useProps } from './PlayerProps'

export function PlayerSwitchState() {
  const { content } = useNodes()
  const { switchState, onSwitchRetry } = useProps()

  return (
    <div
      id='player-switch-state'
      className={cn(
        'z-[4] absolute top-0 left-0 w-full h-full',
        'items-center justify-center text-white bg-black',
        'data-[visible="true"]:flex data-[visible="false"]:hidden',
      )}
      data-visible={switchState.state !== SwitchState.IDLE}
    >
      <LoaderIcon
        className={cn('sm:w-[75px] sm:h-[75px] w-[35px] h-[35px] data-[visible="false"]:hidden')}
        data-visible={switchState.state === SwitchState.LOADING}
      />
      <AlertErrorDialog
        open={switchState.state === SwitchState.ERROR}
        error={switchState.error}
        container={content}
        className='[&_*]:!select-text'
        onReload={onSwitchRetry}
      />
    </div>
  )
}
