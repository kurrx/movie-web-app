import { NavLink } from 'react-router-dom'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  ScrollArea,
} from '../ui'
import { NavbarExploreProps } from './NavbarExplore'

export function NavbarExploreDesktop({ children, navigation }: NavbarExploreProps) {
  return (
    <div className='mr-4 hidden md:flex'>
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost'>Explore</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-40' align='start'>
          <DropdownMenuGroup>
            {Object.entries(navigation).map(([typeId, type]) => (
              <DropdownMenuSub key={typeId}>
                <DropdownMenuSubTrigger>{type.title}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <NavLink to={`/explore/${typeId}`}>
                      <DropdownMenuItem>All</DropdownMenuItem>
                    </NavLink>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Genres</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <ScrollArea className='h-40'>
                            {Object.entries(type.genres).map(([genreId, genre]) => (
                              <NavLink key={genreId} to={`/explore/${typeId}/${genreId}`}>
                                <DropdownMenuItem>{genre}</DropdownMenuItem>
                              </NavLink>
                            ))}
                          </ScrollArea>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Collections</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <ScrollArea className={type.collections.length > 5 ? 'h-40' : ''}>
                            {type.collections.map((collection) => (
                              <NavLink key={collection.url} to={`/explore${collection.url}`}>
                                <DropdownMenuItem>{collection.title}</DropdownMenuItem>
                              </NavLink>
                            ))}
                          </ScrollArea>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
