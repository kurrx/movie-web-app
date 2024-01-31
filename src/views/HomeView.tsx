import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

import { cn } from '@/api'
import { Button } from '@/components'
import { setSearchOpen, Title } from '@/features'
import { useStoreBoolean } from '@/hooks'

const classes = {
  root: cn('flex-1 flex flex-col container'),
  wrapper: cn(
    'flex-1 flex items-center justify-center flex-col',
    'mx-auto max-w-[980px]',
    'gap-2 py-8 md:py-12 lg:py-24 md:pb-8 lg:pb-20',
  ),
  title: cn(
    'text-center font-bold text-3xl',
    'sm:text-5xl md:text-6xl',
    'leading-tight tracking-tighter lg:leading-[1.1]',
  ),
  subtitle: cn(
    'inline-block align-top',
    'max-w-[310px] sm:max-w-[470px] md:max-w-[570px]',
    'text-center text-md sm:text-lg md:text-xl text-muted-foreground',
  ),
  button: {
    root: cn('w-[50%]'),
    wrapper: cn('flex w-full items-center justify-center space-x-4 py-4 md:pb-10'),
    icon: cn('mr-2 h-4 w-4'),
  },
}

export function HomeView() {
  const { setTrue: open } = useStoreBoolean(setSearchOpen)

  return (
    <div className={classes.root}>
      <Title>Home</Title>
      <section className={classes.wrapper}>
        <h1 className={classes.title}>Watch Anything,&nbsp;Anytime.</h1>
        <p className={classes.subtitle}>
          Your&nbsp;Seat. Your&nbsp;Show. Your&nbsp;Cinematic&nbsp;Journey.
        </p>
        <div className={classes.button.wrapper}>
          <Button className={classes.button.root} onClick={open}>
            <MagnifyingGlassIcon className={classes.button.icon} /> Explore
          </Button>
        </div>
      </section>
    </div>
  )
}
