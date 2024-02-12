import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'

import { cn } from '@/api'
import {
  QualityIcon,
  SeekIcon,
  SettingsIcon,
  SettingsOutlinedIcon,
  SpeedIcon,
  SubtitleIcon,
  TranslatorIcon,
  UkraineIcon,
} from '@/assets'
import { useElementRect, useStore } from '@/hooks'
import { ItemTranslator, StreamQuality } from '@/types'

import {
  selectPlayerJumpStep,
  selectPlayerPlaybackSpeed,
  setPlayerJumpStep,
  setPlayerPlaybackSpeed,
} from '../../player.slice'
import { useProps } from '../PlayerProps'
import {
  MenuSection,
  MenuSectionButton,
  MenuSectionSelect,
  MenuSectionSelectValue,
  MenuWrapper,
} from './Menu'

function playbackSpeedToStr(playbackSpeed: number) {
  return playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}`
}

function qualityToNode(quality: StreamQuality) {
  return (
    <Fragment>
      {quality.id}
      {quality.altername && (
        <sup className='ml-1 opacity-[0.75] font-bold'>{quality.altername}</sup>
      )}
    </Fragment>
  )
}

function translatorToNode(translator: ItemTranslator) {
  return <span className='w-[6.25rem] inline-block truncate text-right'>{translator.name}</span>
}

function Translator({ translator }: { translator: ItemTranslator }) {
  const titleRef = useRef<HTMLSpanElement>(null)
  const { width } = useElementRect(titleRef)

  useEffect(() => {
    if (!titleRef.current) return
    titleRef.current.style.setProperty('--title-width', `${width}px`)
  }, [width])

  return (
    <span className='flex items-center justify-between flex-1 pr-6' title={translator.name}>
      <span ref={titleRef} className='flex items-center justify-start text-left grow min-w-0'>
        <span className='truncate max-w-[calc(var(--title-width)-30px)]'>{translator.name}</span>
        {translator.isUkranian && <UkraineIcon className='ml-2 w-4 h-4' />}
      </span>
      {!!translator.rating && (
        <span className='text-muted-foreground ml-4'>{translator.rating.toFixed(0)}%</span>
      )}
    </span>
  )
}

export function SettingsMenu() {
  const [dispatch, selector] = useStore()
  const {
    quality,
    qualities,
    onQualityChange,
    translator,
    translators,
    onTranslatorChange,
    subtitle,
    subtitles,
    onSubtitleChange,
  } = useProps()
  const jumpStep = selector(selectPlayerJumpStep)
  const playbackSpeed = selector(selectPlayerPlaybackSpeed)
  const subtitleLabel = useMemo(
    () => subtitles.find((s) => s.srcLang === subtitle)?.label,
    [subtitles, subtitle],
  )

  const onJumpStepChange = useCallback(
    (jumpStep: number) => {
      dispatch(setPlayerJumpStep(jumpStep))
    },
    [dispatch],
  )

  const onPlaybackSpeedChange = useCallback(
    (playbackSpeed: number) => {
      dispatch(setPlayerPlaybackSpeed(playbackSpeed))
    },
    [dispatch],
  )

  const onQualityChangeHandler = useCallback(
    (quality: StreamQuality) => {
      onQualityChange(quality.id)
    },
    [onQualityChange],
  )

  const onTranslatorChangeHandler = useCallback(
    (translator: ItemTranslator) => {
      onTranslatorChange(translator.id)
    },
    [onTranslatorChange],
  )

  return (
    <MenuWrapper
      id='settings'
      tooltip='Settings'
      badge={quality.altername}
      Icon={(settings) => (
        <SettingsIcon className={cn(settings ? 'rotate-45' : 'rotate-0', 'transition-transform')} />
      )}
      MobileIcon={<SettingsOutlinedIcon className='!w-6 !h-6' />}
    >
      <MenuSection key='main' main>
        <MenuSectionButton value={`${jumpStep}s`} icon={<SeekIcon />}>
          Time Jump
        </MenuSectionButton>

        <MenuSectionButton value={playbackSpeedToStr(playbackSpeed)} icon={<SpeedIcon />}>
          Playback Speed
        </MenuSectionButton>

        {subtitles.length > 0 && (
          <MenuSectionButton value={subtitleLabel || 'Off'} icon={<SubtitleIcon />}>
            Subtitle
          </MenuSectionButton>
        )}

        {qualities.length > 1 && (
          <MenuSectionButton value={qualityToNode(quality)} icon={<QualityIcon />}>
            Quality
          </MenuSectionButton>
        )}

        {translators.length > 1 && (
          <MenuSectionButton value={translatorToNode(translator)} icon={<TranslatorIcon />}>
            Translator
          </MenuSectionButton>
        )}
      </MenuSection>

      <MenuSection key='jump' name='Time Jump'>
        <MenuSectionSelect
          selected={jumpStep}
          closeOnChange='section'
          onSelectedChange={onJumpStepChange}
        >
          {[1, 5, 10, 15, 20, 25, 30].map((step) => (
            <MenuSectionSelectValue key={step} value={step}>
              {step + (step === 1 ? ' second' : ' seconds')}
            </MenuSectionSelectValue>
          ))}
        </MenuSectionSelect>
      </MenuSection>

      <MenuSection key='playback' name='Playback Speed'>
        <MenuSectionSelect
          selected={playbackSpeed}
          closeOnChange='section'
          onSelectedChange={onPlaybackSpeedChange}
        >
          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
            <MenuSectionSelectValue key={speed} value={speed}>
              {playbackSpeedToStr(speed)}
            </MenuSectionSelectValue>
          ))}
        </MenuSectionSelect>
      </MenuSection>

      {subtitles.length > 0 && (
        <MenuSection key='subtitle' name='Subtitle' isScrollable={subtitles.length > 8}>
          <MenuSectionSelect
            selected={subtitle}
            closeOnChange='section'
            onSelectedChange={onSubtitleChange}
          >
            {[{ srcLang: null, label: 'Off' }, ...subtitles].map((s) => (
              <MenuSectionSelectValue key={`${s.srcLang}`} value={s.srcLang}>
                {s.label}
              </MenuSectionSelectValue>
            ))}
          </MenuSectionSelect>
        </MenuSection>
      )}

      {qualities.length > 1 && (
        <MenuSection key='quality' name='Quality' isScrollable={qualities.length > 8}>
          <MenuSectionSelect
            selected={quality}
            closeOnChange='menu'
            equals={(a, b) => a.id === b.id}
            onSelectedChange={onQualityChangeHandler}
          >
            {qualities.map((_, index) => {
              const quality = qualities[qualities.length - index - 1]
              return (
                <MenuSectionSelectValue key={quality.id} value={quality}>
                  {qualityToNode(quality)}
                </MenuSectionSelectValue>
              )
            })}
          </MenuSectionSelect>
        </MenuSection>
      )}

      {translators.length > 1 && (
        <MenuSection key='translator' name='Translator' isScrollable={translators.length > 8}>
          <MenuSectionSelect
            selected={translator}
            closeOnChange='menu'
            equals={(a, b) => a.id === b.id}
            onSelectedChange={onTranslatorChangeHandler}
          >
            {translators.map((translator) => (
              <MenuSectionSelectValue key={translator.id} value={translator}>
                <Translator translator={translator} />
              </MenuSectionSelectValue>
            ))}
          </MenuSectionSelect>
        </MenuSection>
      )}
    </MenuWrapper>
  )
}
