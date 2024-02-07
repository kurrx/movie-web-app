import { Ending } from '../Ending'
import { Gestures } from '../Gestures'
import { Loader } from '../Loader'
import { SeekProgress } from '../SeekProgress'
import { Actions } from './Actions'
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
    </Wrapper>
  )
}
