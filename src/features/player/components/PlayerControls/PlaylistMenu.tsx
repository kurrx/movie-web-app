import { cn } from '@/api'
import { PlaylistIcon, PlaylistOutlinedIcon } from '@/assets'
import { WatchPlaylistItemSeason } from '@/types'

import { useProps } from '../PlayerProps'
import {
  MenuSection,
  MenuSectionEpisode,
  MenuSectionFranchise,
  MenuSectionSeason,
  MenuWrapper,
} from './Menu'

export function PlaylistMenu() {
  const { playlist } = useProps()

  if (playlist.items.length === 0) return null

  return (
    <MenuWrapper
      id='playlist'
      tooltip='Playlist'
      Icon={(playlist) => (
        <PlaylistIcon
          className={cn(playlist ? 'scale-[1]' : 'scale-[0.9]', 'transition-transform')}
        />
      )}
      MobileIcon={<PlaylistOutlinedIcon className='!w-6 !h-6' />}
    >
      <MenuSection
        key='main'
        main
        isScrollable={playlist.items.length > 4}
        className='!h-[16rem]'
        topContent={
          <h3 className='font-bold w-full px-5 pt-3 pb-5 text-xs border-b'>{playlist.title}</h3>
        }
      >
        {playlist.items.map((item, index) => {
          if (item.type === 'franchise') {
            return <MenuSectionFranchise key={index} item={item} />
          }
          return <MenuSectionSeason key={index} item={item} />
        })}
      </MenuSection>

      {playlist.items
        .filter((i) => i.type === 'season')
        .map((item, sIndex) => {
          const season = (item as WatchPlaylistItemSeason).number
          const title = `${season} Сезон`
          const episodes = (item as WatchPlaylistItemSeason).episodes
          return (
            <MenuSection
              key={sIndex}
              name={title}
              isScrollable={episodes.length > 5}
              className='!h-[20rem]'
            >
              {episodes.map((episode, eIndex) => (
                <MenuSectionEpisode key={`${sIndex}-${eIndex}`} item={episode} />
              ))}
            </MenuSection>
          )
        })}
    </MenuWrapper>
  )
}
