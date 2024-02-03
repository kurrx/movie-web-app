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
    </Wrapper>
  )
}
