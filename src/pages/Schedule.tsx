import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

type Day = (typeof days)[number]

type ScheduleCategory =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'wushu-a'
  | 'wushu-b'
  | 'taichi'
  | 'kickboxing'
  | 'private'
  | 'lunch'

type ScheduleEntry = {
  day: Day
  title: string
  start: string
  end: string
  description?: string
  category: ScheduleCategory
  slot?: string
}

type TimedEntry = ScheduleEntry & {
  startMinutes: number
  endMinutes: number
  rowSpan: number
  displayTime: string
}

const timeStep = 10

const scheduleEntries: ScheduleEntry[] = [
  {
    day: 'Saturday',
    title: 'Private Lesson',
    start: '10:00',
    end: '11:00',
    slot: '10:00-11:00',
    description: 'One-on-one coaching for personalized technique and progress.',
    category: 'private',
  },
  {
    day: 'Tuesday',
    title: 'Tai Chi (All Level)',
    start: '11:00',
    end: '12:00',
    slot: '11:00-12:00',
    description: 'Mindful movement for balance, breath, and calm strength.',
    category: 'taichi',
  },
  {
    day: 'Wednesday',
    title: 'Private Lessons',
    start: '11:00',
    end: '12:00',
    slot: '11:00-12:00',
    description: 'Focused coaching tailored to your goals and level.',
    category: 'private',
  },
  {
    day: 'Thursday',
    title: 'Tai Chi (All Level)',
    start: '11:00',
    end: '12:00',
    slot: '11:00-12:00',
    description: 'Flow training with slow, controlled movement.',
    category: 'taichi',
  },
  {
    day: 'Friday',
    title: 'Private Lessons',
    start: '11:00',
    end: '12:00',
    slot: '11:00-12:00',
    description: 'Focused coaching tailored to your goals and level.',
    category: 'private',
  },
  {
    day: 'Saturday',
    title: 'Tai Chi (All Level)',
    start: '11:00',
    end: '12:00',
    slot: '11:00-12:00',
    description: 'Mindful movement for balance, breath, and calm strength.',
    category: 'taichi',
  },
  {
    day: 'Saturday',
    title: 'Beginner',
    start: '14:00',
    end: '15:00',
    slot: '2:00-3:00',
    description: 'White belt fundamentals: stances, strikes, and coordination.',
    category: 'beginner',
  },
  {
    day: 'Saturday',
    title: 'Intermediate',
    start: '15:00',
    end: '16:00',
    slot: '3:00-4:00',
    description: 'Green to brown belt techniques, strength, and flexibility.',
    category: 'intermediate',
  },
  {
    day: 'Tuesday',
    title: 'Beginner',
    start: '16:10',
    end: '17:00',
    slot: '4:10-5:00',
    description: 'White belt fundamentals: stances, strikes, and coordination.',
    category: 'beginner',
  },
  {
    day: 'Wednesday',
    title: 'Beginner',
    start: '16:10',
    end: '17:00',
    slot: '4:10-5:00',
    description: 'White belt fundamentals: stances, strikes, and coordination.',
    category: 'beginner',
  },
  {
    day: 'Thursday',
    title: 'Beginner',
    start: '16:10',
    end: '17:00',
    slot: '4:10-5:00',
    description: 'White belt fundamentals: stances, strikes, and coordination.',
    category: 'beginner',
  },
  {
    day: 'Friday',
    title: 'Beginner',
    start: '16:10',
    end: '17:00',
    slot: '4:10-5:00',
    description: 'White belt fundamentals: stances, strikes, and coordination.',
    category: 'beginner',
  },
  {
    day: 'Saturday',
    title: 'Wushu Team B',
    start: '16:00',
    end: '17:30',
    slot: '4:00-5:30',
    description: 'Performance team training for developing competitors.',
    category: 'wushu-b',
  },
  {
    day: 'Monday',
    title: 'Wushu Team B',
    start: '17:00',
    end: '18:30',
    slot: '5:00-6:30',
    description: 'Performance team training for developing competitors.',
    category: 'wushu-b',
  },
  {
    day: 'Tuesday',
    title: 'Intermediate',
    start: '17:00',
    end: '18:00',
    slot: '5:00-6:00',
    description: 'Green to brown belt techniques, strength, and flexibility.',
    category: 'intermediate',
  },
  {
    day: 'Wednesday',
    title: 'Intermediate',
    start: '17:00',
    end: '18:00',
    slot: '5:00-6:00',
    description: 'Green to brown belt techniques, strength, and flexibility.',
    category: 'intermediate',
  },
  {
    day: 'Thursday',
    title: 'Intermediate',
    start: '17:00',
    end: '18:00',
    slot: '5:00-6:00',
    description: 'Green to brown belt techniques, strength, and flexibility.',
    category: 'intermediate',
  },
  {
    day: 'Friday',
    title: 'Intermediate',
    start: '17:00',
    end: '18:00',
    slot: '5:00-6:00',
    description: 'Green to brown belt techniques, strength, and flexibility.',
    category: 'intermediate',
  },
  {
    day: 'Saturday',
    title: 'Wushu Team A',
    start: '17:30',
    end: '19:00',
    slot: '5:30-7:00',
    description: 'Competition team training for advanced athletes.',
    category: 'wushu-a',
  },
  {
    day: 'Monday',
    title: 'Wushu Team A',
    start: '18:30',
    end: '20:00',
    slot: '6:30-8:00',
    description: 'Competition team training for advanced athletes.',
    category: 'wushu-a',
  },
  {
    day: 'Tuesday',
    title: 'Advanced',
    start: '18:00',
    end: '19:00',
    slot: '6:00-7:00',
    description: 'Brown to black belt conditioning, forms, and sparring prep.',
    category: 'advanced',
  },
  {
    day: 'Wednesday',
    title: 'Wushu Team B',
    start: '18:00',
    end: '19:30',
    slot: '6:00-7:30',
    description: 'Performance team training for developing competitors.',
    category: 'wushu-b',
  },
  {
    day: 'Thursday',
    title: 'Advanced',
    start: '18:00',
    end: '19:00',
    slot: '6:00-7:00',
    description: 'Brown to black belt conditioning, forms, and sparring prep.',
    category: 'advanced',
  },
  {
    day: 'Friday',
    title: 'Advanced',
    start: '18:00',
    end: '19:00',
    slot: '6:00-7:00',
    description: 'Brown to black belt conditioning, forms, and sparring prep.',
    category: 'advanced',
  },
  {
    day: 'Tuesday',
    title: 'Wushu Team A',
    start: '19:00',
    end: '20:30',
    slot: '7:00-8:30',
    description: 'Competition team training for advanced athletes.',
    category: 'wushu-a',
  },
  {
    day: 'Wednesday',
    title: 'Tai Chi',
    start: '19:30',
    end: '20:30',
    slot: '7:30-8:30',
    description: 'Evening Tai Chi to close the day with calm movement.',
    category: 'taichi',
  },
  {
    day: 'Thursday',
    title: 'Wushu Team A',
    start: '19:00',
    end: '20:30',
    slot: '7:00-8:30',
    description: 'Competition team training for advanced athletes.',
    category: 'wushu-a',
  },
  {
    day: 'Friday',
    title: 'All Level Kickboxing',
    start: '19:00',
    end: '20:00',
    slot: '7:00-8:00',
    description: 'Cardio, striking, and footwork for every level.',
    category: 'kickboxing',
  },
]

const lunchStart = '12:00'
const lunchEnd = '14:00'

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const lunchStartMinutes = toMinutes(lunchStart)
const lunchEndMinutes = toMinutes(lunchEnd)

const formatTime = (minutes: number) => {
  const normalized = ((minutes % 1440) + 1440) % 1440
  const hours = Math.floor(normalized / 60)
  const mins = normalized % 60
  const displayHour = ((hours + 11) % 12) + 1
  return `${displayHour}:${mins.toString().padStart(2, '0')}`
}

const formatRange = (startMinutes: number, endMinutes: number) =>
  `${formatTime(startMinutes)}-${formatTime(endMinutes)}`

const buildSchedule = () => {
  const normalizedEntries: TimedEntry[] = scheduleEntries.map((entry) => {
    const startMinutes = toMinutes(entry.start)
    const endMinutes = toMinutes(entry.end)
    return {
      ...entry,
      startMinutes,
      endMinutes,
      rowSpan: Math.max(1, Math.ceil((endMinutes - startMinutes) / timeStep)),
      displayTime: entry.slot ?? formatRange(startMinutes, endMinutes),
    }
  })

  const entriesByDayStart = new Map<Day, Map<number, TimedEntry>>()
  const coveredByDay = new Map<Day, Set<number>>()

  days.forEach((day) => {
    entriesByDayStart.set(day, new Map())
    coveredByDay.set(day, new Set())
  })

  normalizedEntries.forEach((entry) => {
    entriesByDayStart.get(entry.day)?.set(entry.startMinutes, entry)
    const covered = coveredByDay.get(entry.day)
    if (!covered) {
      return
    }
    for (let time = entry.startMinutes + timeStep; time < entry.endMinutes; time += timeStep) {
      covered.add(time)
    }
  })

  const start = Math.min(...normalizedEntries.map((entry) => entry.startMinutes))
  const end = Math.max(...normalizedEntries.map((entry) => entry.endMinutes))

  const timeSlots: number[] = []
  let time = start
  while (time < end) {
    timeSlots.push(time)
    if (time === lunchStartMinutes) {
      time = lunchEndMinutes
    } else {
      time += timeStep
    }
  }

  return { entriesByDayStart, coveredByDay, timeSlots }
}

const { entriesByDayStart, coveredByDay, timeSlots } = buildSchedule()

const categoryLabels: Record<ScheduleCategory, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  'wushu-a': 'Wushu Team A',
  'wushu-b': 'Wushu Team B',
  taichi: 'Tai Chi',
  kickboxing: 'Kickboxing',
  private: 'Private Lessons',
  lunch: 'Lunch',
}

const parseHighlightCategories = (search: string): ScheduleCategory[] => {
  const highlight = new URLSearchParams(search).get('highlight') ?? ''
  if (!highlight) {
    return []
  }
  const tokens = highlight
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
  const categories: ScheduleCategory[] = []
  const addCategory = (category: ScheduleCategory) => {
    if (!categories.includes(category)) {
      categories.push(category)
    }
  }

  tokens.forEach((token) => {
    if (token.includes('beginner')) {
      addCategory('beginner')
    }
    if (token.includes('intermediate')) {
      addCategory('intermediate')
    }
    if (token.includes('advanced')) {
      addCategory('advanced')
    }
    if (token.includes('wushu') || token.includes('team')) {
      addCategory('wushu-a')
      addCategory('wushu-b')
    }
    if (token.includes('tai')) {
      addCategory('taichi')
    }
    if (token.includes('kick') || token.includes('sanda')) {
      addCategory('kickboxing')
    }
    if (token.includes('private')) {
      addCategory('private')
    }
  })

  return categories
}

const Schedule = () => {
  const location = useLocation()
  const [activeEntry, setActiveEntry] = useState<TimedEntry | null>(null)
  const highlightCategories = useMemo(
    () => parseHighlightCategories(location.search),
    [location.search]
  )
  const highlightSet = useMemo(() => new Set(highlightCategories), [highlightCategories])
  const highlightLabels = highlightCategories.map((category) => categoryLabels[category])
  const highlightActive = highlightCategories.length > 0

  useEffect(() => {
    if (!activeEntry) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveEntry(null)
      }
    }

    document.body.classList.add('lightbox-open')
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('lightbox-open')
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeEntry])

  useEffect(() => {
    if (!highlightActive) {
      return
    }
    const target = document.querySelector<HTMLElement>('.schedule-card--highlight')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [highlightActive, highlightCategories])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Class Schedule</div>
          <h1>Current Training Schedule</h1>
          <p>
            Effective February 1, 2024. Contact us for a free trial class and the latest class
            updates.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="reveal">
            <h2 className="section-title">Weekly schedule</h2>
            <p className="section-subtitle">
              Tap a class to expand details. Reach out if you want help choosing the right program
              or level.
            </p>
            <div className="cta" style={{ marginTop: '20px' }}>
              <Link className="button" to="/#contact">
                Contact for a trial class
              </Link>
            </div>
          </div>
          {highlightActive ? (
            <div className="schedule-highlight reveal" style={{ '--delay': '0.05s' } as CSSProperties}>
              <span>
                <strong>Highlighting:</strong> {highlightLabels.join(', ')}
              </span>
              <Link className="button ghost small" to="/schedule">
                Clear highlight
              </Link>
            </div>
          ) : null}
          <div
            className={`schedule-table-wrapper reveal${
              highlightActive ? ' schedule-table-wrapper--highlighting' : ''
            }`}
            style={{ '--delay': '0.1s' } as CSSProperties}
          >
            <table className="schedule-table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  {days.map((day) => (
                    <th scope="col" key={day}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => {
                  if (time === lunchStartMinutes) {
                    return (
                      <tr key={time} className="schedule-lunch-row">
                        <th scope="row" className="schedule-time schedule-time--range">
                          {formatRange(lunchStartMinutes, lunchEndMinutes)}
                        </th>
                        <td colSpan={days.length} className="schedule-lunch-cell">
                          <div className="schedule-lunch-block">Lunch Time</div>
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr key={time}>
                      <th scope="row" className="schedule-time">
                        {formatTime(time)}
                      </th>
                      {days.map((day) => {
                        const entry = entriesByDayStart.get(day)?.get(time)
                        if (entry) {
                          const isHighlighted = highlightSet.has(entry.category)
                          const cardClasses = [
                            'schedule-card',
                            'schedule-card-button',
                            `schedule-card--${entry.category}`,
                            isHighlighted ? 'schedule-card--highlight' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')

                          return (
                            <td key={`${day}-${time}`} rowSpan={entry.rowSpan} className="schedule-cell">
                              <button
                                type="button"
                                className={cardClasses}
                                onClick={() => setActiveEntry(entry)}
                                aria-label={`View details for ${entry.title}`}
                              >
                                <span className="schedule-title">{entry.title}</span>
                                <span className="schedule-slot">{entry.displayTime}</span>
                                <span className="schedule-hint">View details</span>
                              </button>
                            </td>
                          )
                        }

                        if (coveredByDay.get(day)?.has(time)) {
                          return null
                        }

                        return (
                          <td key={`${day}-${time}`}>
                            <div className="schedule-empty" aria-hidden="true" />
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {activeEntry ? (
        <div
          className="schedule-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeEntry.title} details`}
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="schedule-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="lightbox-close" onClick={() => setActiveEntry(null)}>
              Close
            </button>
            <div className="schedule-modal-header">
              <h3>{activeEntry.title}</h3>
              <div className="schedule-modal-meta">
                <span>{activeEntry.day}</span>
                <span>{activeEntry.displayTime}</span>
              </div>
            </div>
            <p className="schedule-modal-description">
              {activeEntry.description ?? 'Details coming soon.'}
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Schedule
