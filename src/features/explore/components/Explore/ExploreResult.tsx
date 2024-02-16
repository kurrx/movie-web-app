import { CaretSortIcon, TextAlignJustifyIcon } from '@radix-ui/react-icons'
import { NavLink } from 'react-router-dom'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components'
import { ExploreResponse } from '@/types'
import { ErrorView } from '@/views'

import { ExploreItems } from '../ExploreItems'
import { urlToRoute } from '../utils'

export interface ExploreResultProps {
  url: string
  response: ExploreResponse
}

type Sort = NonNullable<ExploreResponse['sort']>
function filterProps(sort: Sort, key: Sort['active'], url: string) {
  const active = sort.active === key
  const to = urlToRoute(sort.active === key ? url : sort[key])
  return { to, 'data-active': active }
}

type Filter = NonNullable<ExploreResponse['filter']>
function filterLink(sort: Filter, key: Filter['active'], url: string) {
  const active = sort.active === key
  const to = urlToRoute(sort.active === key ? url : sort[key])
  return { to, 'data-active': active }
}

export function ExploreResult({ url, response }: ExploreResultProps) {
  return (
    <div className='container flex-1 flex flex-col mt-8 mb-16'>
      <h1 className='sm:text-4xl text-2xl font-bold'>{response.title}</h1>
      {(response.sort || response.filter) && (
        <div className='flex items-center justify-start space-x-2 mt-4'>
          {response.sort && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='sm' variant='secondary'>
                  <CaretSortIcon className='w-5 h-5 mr-1' />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent collisionPadding={{ left: 12, right: 12 }}>
                <DropdownMenuItem asChild>
                  <NavLink {...filterProps(response.sort, 'last', url)}>Последние</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink {...filterProps(response.sort, 'popular', url)}>Популярные</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink {...filterProps(response.sort, 'soon', url)}>В ожидании</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink {...filterProps(response.sort, 'watching', url)}>Сейчас смотрят</NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {response.filter && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='sm' variant='secondary'>
                  <TextAlignJustifyIcon className='w-5 h-5 mr-1' />
                  Filter by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent collisionPadding={{ left: 12, right: 12 }}>
                <DropdownMenuItem asChild>
                  <NavLink {...filterLink(response.filter, 'all', url)}>Все</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink {...filterLink(response.filter, 'films', url)}>Фильмы</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink {...filterLink(response.filter, 'series', url)}>Сериалы</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink {...filterLink(response.filter, 'cartoons', url)}>Мультфильмы</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink {...filterLink(response.filter, 'animation', url)}>Аниме</NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      {response.items.length > 0 ? (
        <ExploreItems url={url} items={response.items} pagination={response.pagination} />
      ) : (
        <ErrorView title='Oops' subtitle='Nothing found.' docTitle='Not Found' />
      )}
    </div>
  )
}
