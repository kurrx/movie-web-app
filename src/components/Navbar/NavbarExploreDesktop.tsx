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

export function NavbarExploreDesktop({ children, navigation, onExploreOpen }: NavbarExploreProps) {
  return (
    <div className='mr-4 hidden md:flex'>
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost'>Explore</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-40' align='start'>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <NavLink to='/explore/new'>New</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to='/explore/collections'>All Collections</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExploreOpen}>Best</DropdownMenuItem>
            {Object.entries(navigation).map(([typeId, type]) => (
              <DropdownMenuSub key={typeId}>
                <DropdownMenuSubTrigger>{type.title}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem asChild>
                      <NavLink to={`/explore/${typeId}`}>All</NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Genres</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <ScrollArea className='h-40'>
                            {Object.entries(type.genres).map(([genreId, genre]) => (
                              <DropdownMenuItem key={genreId} asChild>
                                <NavLink to={`/explore/${typeId}/${genreId}`}>{genre}</NavLink>
                              </DropdownMenuItem>
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
                              <DropdownMenuItem key={collection.url} asChild>
                                <NavLink to={`/explore${collection.url}`}>
                                  {collection.title}
                                </NavLink>
                              </DropdownMenuItem>
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
