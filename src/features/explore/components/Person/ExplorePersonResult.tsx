import { useMemo } from 'react'

import { Table } from '@/components'
import { ExplorePerson } from '@/types'

import { ExploreItems } from '../ExploreItems'
import { ExplorePersonGallery } from './ExplorePersonGallery'

export function ExplorePersonResult({ person }: { person: ExplorePerson }) {
  const birthDate = useMemo(() => {
    if (!person.birthDate) return null
    const ageDifMs = Date.now() - person.birthDate.getTime()
    const ageDate = new Date(ageDifMs)
    const age = Math.abs(ageDate.getUTCFullYear() - 1970)
    return `${person.birthDate.toDateString()} • ${age} years old`
  }, [person])

  return (
    <div className='container mt-8 mb-16'>
      <div className='flex sm:flex-row flex-col'>
        <div className='shrink-0'>
          <ExplorePersonGallery person={person} />
        </div>
        <div className='flex-1 sm:ml-8 mt-4 sm:mt-0'>
          <h1 className='sm:text-4xl text-2xl font-bold text-center sm:text-left'>{person.name}</h1>
          {person.engName && (
            <p className='text-lg font-medium text-muted-foreground text-center sm:text-left'>
              {person.engName}
            </p>
          )}
          <Table.Root className='mt-4'>
            {person.roles.length > 0 && (
              <Table.Row>
                <Table.TitleCol className='sm:w-[10rem] w-[7rem]'>Career</Table.TitleCol>
                <Table.Col className='text-primary'>{person.roles.join(', ')}</Table.Col>
              </Table.Row>
            )}
            {birthDate && (
              <Table.Row>
                <Table.TitleCol className='sm:w-[10rem] w-[7rem]'>Birth Date</Table.TitleCol>
                <Table.Col className='text-primary'>{birthDate}</Table.Col>
              </Table.Row>
            )}
            {person.birthPlace && (
              <Table.Row>
                <Table.TitleCol className='sm:w-[10rem] w-[7rem]'>Birth Place</Table.TitleCol>
                <Table.Col className='text-primary'>{person.birthPlace}</Table.Col>
              </Table.Row>
            )}
            {person.height && (
              <Table.Row>
                <Table.TitleCol className='sm:w-[10rem] w-[7rem]'>Height</Table.TitleCol>
                <Table.Col className='text-primary'>{person.height / 100}m</Table.Col>
              </Table.Row>
            )}
          </Table.Root>
        </div>
      </div>
      {person.rolesItems
        .filter((role) => role.items.length > 0)
        .map((role) => (
          <div key={role.title} className='mt-8'>
            <h2 className='text-lg font-bold'>{role.title}</h2>
            <h3 className='font-medium text-muted-foreground'>{role.subtitle}</h3>
            <ExploreItems items={role.items} />
          </div>
        ))}
    </div>
  )
}
