import { BottomControls } from './BottomControls'
import { Gradient } from './Gradient'
import { Loader } from './Loader'
import { TopInfo } from './TopInfo'
import { Wrapper } from './Wrapper'

export function DesktopControls() {
  return (
    <Wrapper>
      <Gradient position='top' />
      <Gradient position='bottom' />
      <Loader />
      <TopInfo />
      <BottomControls.Root>
        <BottomControls.Buttons>
          <BottomControls.ButtonsLeft></BottomControls.ButtonsLeft>
          <BottomControls.ButtonsRight></BottomControls.ButtonsRight>
        </BottomControls.Buttons>
      </BottomControls.Root>
    </Wrapper>
  )
}
