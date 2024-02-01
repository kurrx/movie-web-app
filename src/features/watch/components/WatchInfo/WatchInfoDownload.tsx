import { DownloadIcon } from '@/assets'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components'
import { StreamQuality } from '@/types'

export interface WatchInfoDownloadProps {
  title: string
  qualities: StreamQuality[]
}

export function WatchInfoDownload({ title, qualities }: WatchInfoDownloadProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='rounded-full'>
          <DownloadIcon className='mr-2 h-4 w-4' />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[12rem]'>
        <DropdownMenuGroup>
          {qualities.map(({ id, altername, downloadUrl, downloadSizeStr }) => (
            <DropdownMenuItem key={id} asChild>
              <a
                download={`[${id}] ${title}`}
                href={downloadUrl}
                target='_blank'
                rel='noreferrer'
                className='cursor-pointer'
              >
                {id}
                {altername && (
                  <sup className='text-muted-foreground text-[0.5rem] font-medium'>{altername}</sup>
                )}
                <DropdownMenuShortcut className='tracking-tight'>
                  {downloadSizeStr}
                </DropdownMenuShortcut>
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
