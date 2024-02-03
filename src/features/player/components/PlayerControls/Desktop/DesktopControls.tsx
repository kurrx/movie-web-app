import { Controls } from './Controls'
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
      <Controls.Root>
        <Controls.Buttons>
          <Controls.ButtonsLeft></Controls.ButtonsLeft>
          <Controls.ButtonsRight></Controls.ButtonsRight>
        </Controls.Buttons>
      </Controls.Root>
    </Wrapper>
  )
}
