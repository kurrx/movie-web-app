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
        'relative player-full player-flex text-white',
        'bg-black data-[visible=false]:hidden',
        'after:content-[""] after:block after:w-full',
        'after:pt-[56.25%]',
      )}
      data-visible={switchState.state !== SwitchState.IDLE}
    >
      <LoaderIcon
        className={cn(
          'absolute top-[50%] left-[50%] translate-x-[-50%]',
          'translate-y-[-50%] sm:w-[75px] sm:h-[75px] w-[35px]',
          'h-[35px] data-[visible=false]:hidden',
        )}
        data-visible={switchState.state === SwitchState.LOADING}
      />
      <AlertErrorDialog
        open={switchState.state === SwitchState.ERROR}
        error={switchState.error}
        container={content}
        className='[&_*]:select-text'
        onReload={onSwitchRetry}
      />
    </div>
  )
}
