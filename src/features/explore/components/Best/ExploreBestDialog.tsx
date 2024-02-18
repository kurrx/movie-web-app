import { RocketIcon } from '@radix-ui/react-icons'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from '@/components'
import { explore } from '@/features/router'
import { useAppSelector, useStoreBoolean } from '@/hooks'

import { selectExploreOpen, setExploreOpen } from '../../explore.slice'
import { ExploreBestSelect } from './ExploreBestSelect'

export function ExploreBestDialog() {
  const open = useAppSelector(selectExploreOpen)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { set: onOpenChange, setFalse: close } = useStoreBoolean(setExploreOpen)
  const [type, setType] = useState<string | null>(null)
  const types = useMemo(
    () => Object.entries(explore).map(([key, value]) => ({ value: key, label: value.title })),
    [],
  )
  const [genre, setGenre] = useState<string | null>(null)
  const genres = useMemo(() => {
    if (!type) return []
    return Object.entries(explore[type].genres).map(([key, value]) => ({
      value: key,
      label: value,
    }))
  }, [type])
  const [year, setYear] = useState<string | null>(null)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= 1906; i--) {
      years.push({ value: i.toString(), label: i.toString() })
    }
    return years
  }, [])

  const onSetType = useCallback((value: string | null) => {
    setType(value)
    setGenre(null)
  }, [])

  const onSearch = useCallback(() => {
    if (!type) return
    close()
    let link = `/explore/${type}/best`
    if (genre) link += `/${genre}`
    if (year) link += `/${year}`
    if (pathname !== link) {
      navigate(link)
    }
  }, [close, navigate, pathname, type, genre, year])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Explore Best</DialogTitle>
          <DialogDescription>Find best title that fits your mood.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-5 items-center gap-4'>
            <Label htmlFor='type' className='text-right'>
              Type
            </Label>
            <ExploreBestSelect
              id='type'
              emptyPlaceholder='Select type'
              inputPlaceholder='Search type...'
              values={types}
              value={type}
              notFoundText='Type'
              onChange={onSetType}
            />
            {genres.length > 0 && (
              <Fragment>
                <Label htmlFor='genre' className='text-right'>
                  Genre
                </Label>
                <ExploreBestSelect
                  id='genre'
                  emptyPlaceholder='Any'
                  inputPlaceholder='Search genre...'
                  values={genres}
                  value={genre}
                  notFoundText='Genre'
                  onChange={setGenre}
                />
              </Fragment>
            )}
            <Label htmlFor='year' className='text-right'>
              Year
            </Label>
            <ExploreBestSelect
              id='year'
              emptyPlaceholder='Any'
              inputPlaceholder='Search year...'
              values={years}
              value={year}
              notFoundText='Year'
              onChange={setYear}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={type === null} onClick={onSearch}>
            <RocketIcon className='mr-2 h-4 w-4' />
            Explore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
