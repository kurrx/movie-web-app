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

export interface DownloadMenuProps {
  filename: string
  qualities: StreamQuality[]
}

export function DownloadMenu({ filename, qualities }: DownloadMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='rounded-full' variant='secondary'>
          <DownloadIcon className='mr-2 h-4 w-4' />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[12rem]' collisionPadding={16}>
        <DropdownMenuGroup>
          {qualities.map(({ id, altername, downloadUrl, downloadSize, downloadSizeStr }) => (
            <DropdownMenuItem key={id} asChild>
              <a
                href={`${downloadUrl}?proxy-tv-video-filename=${encodeURIComponent(`${id}_${filename.replaceAll(' ', '_')}.mp4`)}`}
                className='cursor-pointer'
                target='_blank'
                rel='noreferrer'
              >
                {id}
                {altername && (
                  <sup className='text-muted-foreground text-[0.5rem] font-medium'>{altername}</sup>
                )}
                <DropdownMenuShortcut className='tracking-tight'>
                  {downloadSize ? downloadSizeStr : '? MB'}
                </DropdownMenuShortcut>
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
