import { cn } from '@/api'
import { LoaderIcon } from '@/assets'
import { Title } from '@/features'

const classes = {
  root: cn('flex-1 flex flex-col items-center justify-center'),
  icon: cn('w-12 h-12'),
}

export interface LoadingViewProps {
  text?: string
  docTitle?: string
}

export function LoadingView({ text, docTitle }: LoadingViewProps) {
  return (
    <div className={classes.root}>
      <Title>{docTitle || 'Loading...'}</Title>
      <LoaderIcon className={classes.icon} />
      {text && <p className='mt-4 font-medium'>{text}</p>}
    </div>
  )
}
