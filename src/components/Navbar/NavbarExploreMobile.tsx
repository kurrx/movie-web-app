import { useCallback, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { cn } from '@/api'
import { MenuIcon } from '@/assets'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../ui'
import { NavbarExploreProps } from './NavbarExplore'

export function NavbarExploreMobile({ children, navigation, onExploreOpen }: NavbarExploreProps) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const handleBestOpen = useCallback(() => {
    setOpen(false)
    onExploreOpen()
  }, [onExploreOpen])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          className={cn(
            'mr-2 px-0 text-base hover:bg-transparent',
            'focus-visible:bg-transparent focus-visible:ring-0',
            'focus-visible:ring-offset-0 md:hidden',
          )}
        >
          <MenuIcon className='h-5 w-5' />
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='pr-0'>
        {children}
        <ScrollArea className='my-4 h-[calc(var(--visual-vh)*100-5rem)] pl-6'>
          <div className='flex flex-col space-y-2'>
            <NavLink to='/explore/new' className='font-bold !mt-6'>
              New Arrivals
            </NavLink>
            <NavLink to='/explore/collections' className='font-bold !mt-6'>
              Collections
            </NavLink>
            <button
              className='font-bold !mt-6 text-left focus:outline-none'
              onClick={handleBestOpen}
            >
              Best of
            </button>
            <Accordion type='multiple' className='w-full !mt-0'>
              {Object.entries(navigation).map(([typeId, type]) => (
                <AccordionItem key={typeId} value={typeId} className='border-0 !mt-6'>
                  <AccordionTrigger className='text-base hover:no-underline outline-none pr-8 py-0'>
                    <h4 className='font-bold'>{type.title}</h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='flex flex-col space-y-3 text-base mt-4'>
                      <NavLink to={`/explore/${typeId}`} className='text-muted-foreground pl-4'>
                        {type.title}
                      </NavLink>
                      <Separator className='w-[calc(100%-2rem)] mx-auto' />
                      {Object.entries(type.genres).map(([genreId, genre]) => (
                        <NavLink
                          key={genreId}
                          to={`/explore/${typeId}/${genreId}`}
                          className='text-muted-foreground pl-4'
                        >
                          {genre}
                        </NavLink>
                      ))}
                      <Separator className='w-[calc(100%-2rem)] mx-auto' />
                      {type.collections.map((collection) => (
                        <NavLink
                          key={collection.url}
                          to={`/explore${collection.url}`}
                          className='text-muted-foreground pl-4'
                        >
                          {collection.title}
                        </NavLink>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
