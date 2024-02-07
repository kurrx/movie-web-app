import { AutoPlaySwitch } from '../AutoPlaySwitch'
import { Ending } from '../Ending'
import { Gestures } from '../Gestures'
import { Loader } from '../Loader'
import { PlaylistMenu } from '../PlaylistMenu'
import { SeekProgress } from '../SeekProgress'
import { SettingsMenu } from '../SettingsMenu'
import { Actions } from './Actions'
import { Controls } from './Controls'
import { Overlay } from './Overlay'
import { Wrapper } from './Wrapper'

export function MobileControls() {
  return (
    <Wrapper>
      <Overlay />
      <Loader />
      <Actions />
      <SeekProgress />
      <Gestures />
      <Ending />
      <Controls.Top>
        <AutoPlaySwitch />
        <PlaylistMenu />
        <SettingsMenu />
      </Controls.Top>
    </Wrapper>
  )
}
