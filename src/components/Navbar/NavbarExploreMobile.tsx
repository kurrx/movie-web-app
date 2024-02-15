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
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../ui'
import { NavbarExploreProps } from './NavbarExplore'

export function NavbarExploreMobile({ children, navigation, onBestOpen }: NavbarExploreProps) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const handleBestOpen = useCallback(() => {
    setOpen(false)
    onBestOpen()
  }, [onBestOpen])

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
            <NavLink to='/explore/collections' className='font-bold !mt-8'>
              All Collections
            </NavLink>
            <button
              className='font-bold !mt-8 text-left focus:outline-none'
              onClick={handleBestOpen}
            >
              Best
            </button>
            {Object.entries(navigation).map(([typeId, type]) => (
              <div key={typeId} className='flex flex-col pt-6'>
                <h4 className='font-bold'>{type.title}</h4>
                <NavLink to={`/explore/${typeId}`} className='text-muted-foreground pl-2 mt-3'>
                  All
                </NavLink>
                <Accordion type='multiple' className='w-full pr-8 pl-2 pt-1.5'>
                  <AccordionItem value='Genres' className='border-0'>
                    <AccordionTrigger className='text-base py-1.5 hover:no-underline outline-none'>
                      <h5 className='font-medium'>Genres</h5>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='flex flex-col space-y-3 text-base pt-1'>
                        {Object.entries(type.genres).map(([genreId, genre]) => (
                          <NavLink
                            key={genreId}
                            to={`/explore/${typeId}/${genreId}`}
                            className='text-muted-foreground pl-2'
                          >
                            {genre}
                          </NavLink>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value='Collections' className='border-0'>
                    <AccordionTrigger className='text-base py-1.5 hover:no-underline outline-none'>
                      <h5 className='font-medium'>Collections</h5>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='flex flex-col space-y-3 text-base pt-1'>
                        {type.collections.map((collection) => (
                          <NavLink
                            key={collection.url}
                            to={`/explore${collection.url}`}
                            className='text-muted-foreground pl-2'
                          >
                            {collection.title}
                          </NavLink>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
