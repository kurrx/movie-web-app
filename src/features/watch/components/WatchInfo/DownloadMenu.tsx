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
          {qualities.map(({ id, altername, downloadUrl, downloadSizeStr }) => (
            <DropdownMenuItem key={id} asChild>
              <a
                href={`${downloadUrl}?proxy-filename=${encodeURIComponent(`${id}_${filename.replaceAll(' ', '_')}.mp4`)}`}
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
