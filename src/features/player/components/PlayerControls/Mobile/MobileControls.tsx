import { Loader } from '../Loader'
import { Overlay } from './Overlay'
import { Wrapper } from './Wrapper'

export function MobileControls() {
  return (
    <Wrapper>
      <Overlay />
      <Loader />
    </Wrapper>
  )
}
