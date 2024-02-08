import { AutoPlaySwitch } from '../AutoPlaySwitch'
import { Ending } from '../Ending'
import { Gestures } from '../Gestures'
import { Loader } from '../Loader'
import { PlaylistMenu } from '../PlaylistMenu'
import { SeekProgress } from '../SeekProgress'
import { SettingsMenu } from '../SettingsMenu'
import { Actions } from './Actions'
import { AdjacentButton } from './AdjacentButton'
import { Controls } from './Controls'
import { FullscreenButton } from './FullscreenButton'
import { Overlay } from './Overlay'
import { PlayButton } from './PlayButton'
import { Timer } from './Timer'
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
      <Controls.Center>
        <AdjacentButton type='prev' />
        <PlayButton />
        <AdjacentButton type='next' />
      </Controls.Center>
      <Controls.Bottom>
        <Controls.BottomInfo>
          <Timer />
          <FullscreenButton />
        </Controls.BottomInfo>
      </Controls.Bottom>
    </Wrapper>
  )
}
