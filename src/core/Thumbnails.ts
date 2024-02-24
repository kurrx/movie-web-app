export interface ThumbnailSegment {
  start: number
  end: number
  url: string
  width: number
  height: number
  x: number
  y: number
}

export class Thumbnails {
  segments: ThumbnailSegment[]
  segmentDuration: number

  constructor() {
    this.segments = []
    this.segmentDuration = 1
  }

  parse(contents: string) {
    contents = contents.replaceAll('WEBVTT\n\n', '')
    const lines = contents.split('\n\n')
    for (const line of lines) {
      const [time, url] = line.split('\n')
      const [start, end] = time.split(' --> ').map((t) => {
        const [hms, ms] = t.split('.')
        const [h, m, s] = hms.split(':').map((n) => parseInt(n))
        return h * 3600 + m * 60 + s + parseInt(ms) / 1000
      })
      const [cleanUrl, xywh] = url.split('#xywh=')
      const [x, y, width, height] = xywh.split(',').map((n) => parseInt(n))
      this.segments.push({
        start,
        end,
        url: cleanUrl,
        width,
        height,
        x,
        y,
      })
    }
    this.segmentDuration = this.segments[0].end - this.segments[0].start
  }

  getSegment(time: number) {
    const segmentIndex = Math.floor(time / this.segmentDuration)
    if (segmentIndex >= this.segments.length) {
      return {
        start: 0,
        end: 0,
        url: '',
        width: 16,
        height: 9,
        x: 0,
        y: 0,
      }
    }
    return this.segments[segmentIndex]
  }

  getPreviewSegment(time: number, preferedWidth: number) {
    const segment = this.getSegment(time)
    if (!segment) return undefined
    const ratio = preferedWidth / segment.width
    const width = segment.width * ratio
    const height = segment.height * ratio
    return {
      width,
      height,
      backgroundPosition: `${-segment.x * ratio}px ${-segment.y * ratio}px`,
      backgroundSize: `${width * 5}px ${height * 5}px`,
      backgroundImage: `url(${segment.url})`,
    }
  }

  getOverlaySegment(time: number, containerWidth: number, containerHeight: number) {
    const segment = this.getSegment(time)
    if (!segment) return undefined
    const videoRatio = segment.width / segment.height
    const containerRatio = containerWidth / containerHeight
    let ratio = 1
    if (videoRatio < containerRatio) {
      ratio = containerHeight / segment.height
    } else {
      ratio = containerWidth / segment.width
    }
    const width = segment.width * ratio
    const height = segment.height * ratio
    return {
      width,
      height,
      backgroundPosition: `${-segment.x * ratio}px ${-segment.y * ratio}px`,
      backgroundSize: `${width * 5}px ${height * 5}px`,
      backgroundImage: `url(${segment.url})`,
    }
  }

  private static validateSegment(data: ThumbnailSegment) {
    try {
      if (typeof data !== 'object' || !data) return null
      if (
        typeof data.start !== 'number' ||
        typeof data.end !== 'number' ||
        typeof data.url !== 'string' ||
        typeof data.width !== 'number' ||
        typeof data.height !== 'number' ||
        typeof data.x !== 'number' ||
        typeof data.y !== 'number'
      ) {
        return null
      }
      return {
        start: data.start,
        end: data.end,
        url: data.url,
        width: data.width,
        height: data.height,
        x: data.x,
        y: data.y,
      }
    } catch {
      return null
    }
  }

  static getBackgroundWithHeight(segment: ThumbnailSegment, preferedHeight: number) {
    const newSegment = Thumbnails.validateSegment(segment)
    if (!newSegment) return undefined
    const ratio = preferedHeight / newSegment.height
    const width = newSegment.width * ratio
    const height = newSegment.height * ratio
    return {
      width,
      height,
      backgroundPosition: `${-newSegment.x * ratio}px ${-newSegment.y * ratio}px`,
      backgroundSize: `${width * 5}px ${height * 5}px`,
      backgroundImage: `url(${newSegment.url})`,
    }
  }

  static getBackgroundWithWidth(segment: ThumbnailSegment, preferedWidth: number) {
    const newSegment = Thumbnails.validateSegment(segment)
    if (!newSegment) return undefined
    const ratio = preferedWidth / newSegment.width
    const width = newSegment.width * ratio
    const height = newSegment.height * ratio
    return {
      width,
      height,
      backgroundPosition: `${-newSegment.x * ratio}px ${-newSegment.y * ratio}px`,
      backgroundSize: `${width * 5}px ${height * 5}px`,
      backgroundImage: `url(${newSegment.url})`,
    }
  }
}
