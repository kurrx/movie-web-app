import { cn } from '@/api'
import { Separator } from '@/components'
import { Title } from '@/features'

const classes = {
  root: cn('flex-1 flex flex-col items-center justify-center'),
  content: cn(
    'flex flex-col items-center justify-center sm:space-x-4',
    'sm:space-y-0 space-y-0 space-y-4 sm:flex-row',
  ),
  title: cn('font-bold text-3xl'),
  subtitle: cn('text-muted-foreground max-w-[280px] text-center sm:text-left'),
}

export interface ErrorViewProps {
  title?: string
  subtitle?: string
  docTitle?: string
}

export function ErrorView(props: ErrorViewProps) {
  const { title, subtitle, docTitle } = props

  return (
    <div className={classes.root}>
      <Title>{docTitle || 'Error'}</Title>
      <div className={classes.content}>
        <h1 className={classes.title}>{title || 'Oops'}</h1>
        <Separator orientation='vertical' className='hidden sm:block' />
        <Separator orientation='horizontal' className='sm:hidden block' />
        <p className={classes.subtitle}>{subtitle || 'Something went wrong.'}</p>
      </div>
    </div>
  )
}
