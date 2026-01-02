import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const classDescriptions = [
  {
    title: 'Beginner - Intermediate',
    subtitle: 'White to Green Belt',
    description:
      'The beginner level covers white belt through green belt. Students learn studio rules, foundational techniques, kicking and punching routines, jumping and tumbling skills, and traditional Kung Fu forms.',
    highlight: 'beginner,intermediate',
    accent: 'beginner',
  },
  {
    title: 'Advanced',
    subtitle: 'Orange to Black Belt',
    description:
      "The advanced level covers orange belt through black belt. Students explore flexibility and self-control while learning self-defense, advanced forms, and deeper body awareness.",
    highlight: 'advanced',
    accent: 'advanced',
  },
  {
    title: 'Wushu Team',
    subtitle: 'Competitive Martial Arts',
    description:
      'The Wushu team is a focused group of students who want to challenge themselves by competing in national tournaments and performing. Training builds discipline, confidence, and power.',
    highlight: 'wushu',
    accent: 'wushu',
  },
  {
    title: 'Tai Chi',
    subtitle: 'Balance and Energy',
    description:
      'Tai Chi develops internal Qi and is known to reduce tension, stress, and anxiety while bringing the body into harmony.',
    highlight: 'taichi',
    accent: 'taichi',
  },
  {
    title: 'Kickboxing (Sanda)',
    subtitle: 'Power and Conditioning',
    description:
      'Conditioning, striking, and timing with expert coaching. All levels are welcome.',
    highlight: 'kickboxing',
    accent: 'kickboxing',
  },
]

const Classes = () => {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const adjustingRef = useRef(false)
  const scrollEndRef = useRef<number | null>(null)

  const getSetWidth = (track: HTMLDivElement) => track.scrollWidth / 3

  const alignLoop = (track: HTMLDivElement) => {
    const setWidth = getSetWidth(track)
    if (!setWidth) {
      return
    }
    const left = track.scrollLeft
    if (left <= setWidth * 0.1) {
      track.scrollLeft = left + setWidth
    } else if (left >= setWidth * 1.9) {
      track.scrollLeft = left - setWidth
    }
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) {
      return
    }

    const syncPosition = () => {
      const setWidth = getSetWidth(track)
      if (setWidth) {
        track.scrollLeft = setWidth
      }
    }

    const handleResize = () => syncPosition()

    requestAnimationFrame(syncPosition)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (scrollEndRef.current !== null) {
        window.clearTimeout(scrollEndRef.current)
      }
    }
  }, [])

  const scrollTrack = (direction: 'prev' | 'next') => {
    const track = trackRef.current
    if (!track) {
      return
    }
    alignLoop(track)
    const offset = track.clientWidth * 0.85
    track.scrollBy({ left: direction === 'prev' ? -offset : offset, behavior: 'smooth' })
  }

  const handleTrackScroll = () => {
    const track = trackRef.current
    if (!track || adjustingRef.current) {
      return
    }
    if (scrollEndRef.current !== null) {
      window.clearTimeout(scrollEndRef.current)
    }
    scrollEndRef.current = window.setTimeout(() => {
      adjustingRef.current = true
      alignLoop(track)
      requestAnimationFrame(() => {
        adjustingRef.current = false
      })
    }, 80)
  }

  const loopedClasses = [...classDescriptions, ...classDescriptions, ...classDescriptions]

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Classes</div>
          <h1>Class Descriptions</h1>
          <p>
            Explore each class type and highlight its times on the schedule to find the right fit.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="reveal">
            <h2 className="section-title">Explore the class lineup</h2>
            <p className="section-subtitle">
              Tap a class to highlight its times in the schedule and jump to the first block.
            </p>
          </div>
          <div className="classes-carousel">
            <button
              type="button"
              className="carousel-button"
              onClick={() => scrollTrack('prev')}
              aria-label="Scroll classes left"
            >
              &#8592;
            </button>
            <div className="classes-track" ref={trackRef} onScroll={handleTrackScroll}>
              {loopedClasses.map((item, index) => (
                <article
                  className={`info-card class-card carousel-card class-card--${item.accent} reveal`}
                  style={{ '--delay': `${0.1 + index * 0.05}s` } as CSSProperties}
                  key={`${item.title}-${index}`}
                >
                  <div className="class-meta">{item.subtitle}</div>
                  <h3 className="info-card-title">{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="class-card-actions">
                    <Link className="button small" to={`/schedule?highlight=${item.highlight}`}>
                      Highlight schedule
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="carousel-button"
              onClick={() => scrollTrack('next')}
              aria-label="Scroll classes right"
            >
              &#8594;
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Classes
