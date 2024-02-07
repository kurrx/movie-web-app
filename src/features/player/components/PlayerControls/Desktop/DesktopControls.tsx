import { AutoPlaySwitch } from '../AutoPlaySwitch'
import { Ending } from '../Ending'
import { Gestures } from '../Gestures'
import { Loader } from '../Loader'
import { PlaylistMenu } from '../PlaylistMenu'
import { SeekProgress } from '../SeekProgress'
import { SettingsMenu } from '../SettingsMenu'
import { Actions } from './Actions'
import { AdjacentButton, FullscreenButton, PipButton, PlayButton, TheaterButton } from './Buttons'
import { Controls } from './Controls'
import { Gradient } from './Gradient'
import { Heading } from './Heading'
import { Timeline } from './Timeline'
import { Timer } from './Timer'
import { VolumeSlider } from './VolumeSlider'
import { Wrapper } from './Wrapper'

export function DesktopControls() {
  return (
    <Wrapper>
      <Gradient position='top' />
      <Gradient position='bottom' />
      <Loader />
      <Actions />
      <SeekProgress />
      <Gestures />
      <Ending />
      <Heading.Root>
        <Heading.Title />
        <Heading.Buttons>{/* TODO: Share Button */}</Heading.Buttons>
      </Heading.Root>
      <Controls.Root>
        <Timeline />
        <Controls.Buttons>
          <Controls.Side side='left'>
            <AdjacentButton type='prev' />
            <PlayButton />
            <AdjacentButton type='next' />
            <VolumeSlider />
            <Timer />
          </Controls.Side>
          <Controls.Side side='right'>
            <AutoPlaySwitch />
            <PlaylistMenu />
            <SettingsMenu />
            <PipButton />
            <TheaterButton />
            <FullscreenButton />
          </Controls.Side>
        </Controls.Buttons>
      </Controls.Root>
    </Wrapper>
  )
}
