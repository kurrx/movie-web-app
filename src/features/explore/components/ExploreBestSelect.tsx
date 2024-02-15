import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useMemo, useState } from 'react'

import { cn } from '@/api'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components'

export interface ExploreBestSelectProps {
  id: string
  emptyPlaceholder: string
  inputPlaceholder: string
  values: { value: string; label: string }[]
  value: string | null
  notFoundText: string
  onChange: (value: string | null) => void
}

export function ExploreBestSelect(props: ExploreBestSelectProps) {
  const { id, emptyPlaceholder, inputPlaceholder, values, value, notFoundText, onChange } = props
  const selected = useMemo(() => values.find((v) => v.value === value), [value, values])
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='col-span-4 justify-between'
        >
          {value ? values.find((v) => v.value === value)!.label : emptyPlaceholder}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command
          filter={(value, search) => {
            if (value.includes(search)) return 1
            return 0
          }}
        >
          <CommandInput id={id} placeholder={inputPlaceholder} />
          <CommandEmpty>{notFoundText} not found</CommandEmpty>
          <CommandGroup className='max-h-[10.5rem]'>
            {selected && (
              <CommandItem
                value={selected.value}
                onSelect={() => {
                  onChange(null)
                  setOpen(false)
                }}
              >
                <CheckIcon className='mr-2 h-4 w-4' />
                {selected.label}
              </CommandItem>
            )}
            {values
              .filter((v) => v.value !== selected?.value)
              .map((v) => (
                <CommandItem
                  key={v.value}
                  value={`${v.value}__${v.label}`}
                  onSelect={(next) => {
                    const nextValue = next.split('__')[0]
                    onChange(nextValue === value ? null : nextValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn('mr-2 h-4 w-4', value === v.value ? 'opacity-100' : 'opacity-0')}
                  />
                  {v.label}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
