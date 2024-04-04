import { NavLink } from 'react-router-dom'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
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
              <NavLink to='/explore/new'>New Arrivals</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to='/explore/collections'>Collections</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExploreOpen}>Best of</DropdownMenuItem>
            {Object.entries(navigation).map(([typeId, type]) => (
              <DropdownMenuSub key={typeId}>
                <DropdownMenuSubTrigger>{type.title}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <ScrollArea className='h-[10.6rem]'>
                      <DropdownMenuItem asChild>
                        <NavLink to={`/explore/${typeId}`}>{type.title}</NavLink>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {Object.entries(type.genres).map(([genreId, genre]) => (
                        <DropdownMenuItem key={genreId} asChild>
                          <NavLink to={`/explore/${typeId}/${genreId}`}>{genre}</NavLink>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      {type.collections.map((collection) => (
                        <DropdownMenuItem key={collection.url} asChild>
                          <NavLink to={`/explore${collection.url}`}>{collection.title}</NavLink>
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
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
