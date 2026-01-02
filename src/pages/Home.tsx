import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from '../components/Lightbox'
import useLightbox from '../hooks/useLightbox'

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getSlotOptions = (dateValue: string) => {
  if (!dateValue) {
    return []
  }
  const date = new Date(`${dateValue}T00:00:00`)
  const day = date.getDay()
  if (day >= 1 && day <= 5) {
    return ['4:00 PM - 5:00 PM']
  }
  if (day === 6) {
    return ['10:00 AM - 11:00 AM']
  }
  return []
}

const stats = [
  { title: 'All levels', detail: 'Beginner through advanced' },
  { title: 'Kung Fu + Tai Chi', detail: 'Traditional and modern training' },
  { title: 'Community', detail: 'Respect, discipline, confidence' },
]

const programs = [
  {
    title: 'Forms (Taolu)',
    detail: 'Traditional routines that build precision, flexibility, and focus.',
  },
  {
    title: 'Kickboxing (Sanda)',
    detail: 'Conditioning, striking, and timing with expert coaching.',
  },
  {
    title: 'Acrobatics (Nandu)',
    detail: 'Aerial skills to develop power, coordination, and confidence.',
  },
  {
    title: 'Competitive Wushu Team',
    detail: 'Performance training, travel, and competition preparation.',
  },
  {
    title: 'Tai Chi',
    detail: 'Mindful movement for balance, mobility, and calm strength.',
  },
]

const gallery = [
  { src: '/assets/images/gallery-1.jpg', alt: 'Wushu training photo 1' },
  { src: '/assets/images/gallery-2.jpg', alt: 'Wushu training photo 2' },
  { src: '/assets/images/gallery-3.jpg', alt: 'Wushu training photo 3' },
  { src: '/assets/images/gallery-4.jpg', alt: 'Wushu training photo 4' },
]

const Home = () => {
  const { image, open, close } = useLightbox()
  const [trialDate, setTrialDate] = useState('')
  const [trialTime, setTrialTime] = useState('')
  const [trialFeedback, setTrialFeedback] = useState('')

  const slotOptions = useMemo(() => getSlotOptions(trialDate), [trialDate])
  const minDate = useMemo(() => formatDate(new Date()), [])

  useEffect(() => {
    if (!slotOptions.length) {
      if (trialTime) {
        setTrialTime('')
      }
      return
    }
    if (!slotOptions.includes(trialTime)) {
      setTrialTime(slotOptions[0])
    }
  }, [slotOptions, trialTime])

  const handleTrialSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!trialDate || !slotOptions.length || !trialTime) {
      setTrialFeedback('Please select an available date and time slot.')
      return
    }
    setTrialFeedback(`Thanks! We will confirm your free trial for ${trialDate} (${trialTime}).`)
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <div className="eyebrow">Chinese Martial Arts | San Jose, CA</div>
            <h1>Evergreen Wushu</h1>
            <p>
              Wushu means Chinese Martial Arts, also called Kung Fu. At Evergreen Wushu, you will
              learn new skills, meet new friends, and feel accomplished every single day.
            </p>
            <div className="cta">
              <Link className="button" to="/#contact">
                Book Free Trial Class
              </Link>
              <Link className="button ghost" to="/schedule">
                View Schedule
              </Link>
            </div>
            <div className="stats">
              {stats.map((stat) => (
                <div className="stat-card" key={stat.title}>
                  <strong>{stat.title}</strong>
                  <span>{stat.detail}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-media reveal" style={{ '--delay': '0.1s' } as CSSProperties}>
            <button
              type="button"
              className="image-button"
              aria-label="Expand hero training image"
              onClick={() => open('/assets/images/hero.png', 'Students training at Evergreen Wushu')}
            >
              <img src="/assets/images/hero.png" alt="Students training at Evergreen Wushu" />
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 className="section-title reveal">Our Programs</h2>
          <p className="section-subtitle reveal" style={{ '--delay': '0.05s' } as CSSProperties}>
            Explore a wide variety of classes designed for different interests and skill levels.
          </p>
          <div className="program-grid">
            {programs.map((program, index) => (
              <article
                className="program-card reveal"
                style={{ '--delay': `${0.1 + index * 0.05}s` } as CSSProperties}
                key={program.title}
              >
                <h3>{program.title}</h3>
                <p>{program.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container about-grid">
          <div className="about-panel reveal">
            <h2 className="section-title">About Evergreen Wushu</h2>
            <p className="section-subtitle">
              Our school is dedicated to helping students develop new skills, forge meaningful
              friendships, learn traditional Chinese culture, and feel accomplished every day.
            </p>
            <div className="list">
              <span>Classes for kids, teens, and adults</span>
              <span>Traditional Kung Fu paired with modern training</span>
              <span>Goal-driven coaching for every student</span>
            </div>
          </div>
          <div className="about-panel reveal" style={{ '--delay': '0.1s' } as CSSProperties}>
            <h3>Why students stay</h3>
            <p className="section-subtitle">
              Evergreen Wushu emphasizes discipline, respect, and confidence. You will train with a
              team that pushes you while keeping practice safe and fun.
            </p>
            <div className="list">
              <span>Personal progress tracking</span>
              <span>Supportive community culture</span>
              <span>Performance and competition options</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 className="section-title reveal">Inside the Studio</h2>
          <p className="section-subtitle reveal" style={{ '--delay': '0.05s' } as CSSProperties}>
            A glimpse of the training environment and energy you will feel on day one.
          </p>
          <div className="gallery-grid">
            {gallery.map((photo, index) => (
              <button
                type="button"
                className="image-button reveal"
                style={{ '--delay': `${0.1 + index * 0.05}s` } as CSSProperties}
                onClick={() => open(photo.src, photo.alt)}
                aria-label={`Expand ${photo.alt}`}
                key={photo.src}
              >
                <img src={photo.src} alt={photo.alt} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container schedule-preview">
          <div className="reveal">
            <h2 className="section-title">Class Schedule</h2>
            <p className="section-subtitle">
              Our schedule is updated regularly. View the current schedule and contact us if you
              want help picking the right class.
            </p>
            <div className="cta" style={{ marginTop: '20px' }}>
              <Link className="button" to="/schedule">
                See Full Schedule
              </Link>
            </div>
          </div>
          <button
            type="button"
            className="image-button reveal"
            style={{ '--delay': '0.1s' } as CSSProperties}
            onClick={() =>
              open('/assets/images/schedule.jpg', 'Evergreen Wushu class schedule')
            }
            aria-label="Expand class schedule image"
          >
            <img src="/assets/images/schedule.jpg" alt="Evergreen Wushu class schedule" />
          </button>
        </div>
      </section>

      <section>
        <div className="container feature-band reveal">
          <div>
            <h2>Ready to start?</h2>
            <p>Book a free trial class and meet the Evergreen Wushu team.</p>
          </div>
          <div className="feature-band-cta">
            <Link className="button" to="/#contact">
              Book Free Trial Class
            </Link>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="container contact-grid">
          <div className="contact-card reveal">
            <h2 className="section-title">Contact Us</h2>
            <div className="contact-info">
              <span>Evergreen Wushu</span>
              <a href="mailto:info@evergreenwushu.com">info@evergreenwushu.com</a>
              <a href="tel:+14085058809">408.505.8809</a>
              <span>2270 Quimby Rd, San Jose, CA 95122</span>
            </div>
          </div>
          <div className="contact-card booking-card reveal" style={{ '--delay': '0.05s' } as CSSProperties}>
            <h3>Book a free trial</h3>
            <p className="booking-note">Available slots: Mon-Fri 4-5pm, Sat 10-11am.</p>
            <form className="booking-form" onSubmit={handleTrialSubmit}>
              <label>
                <span>First name</span>
                <input type="text" name="trial-first-name" placeholder="First name" required />
              </label>
              <label>
                <span>Last name</span>
                <input type="text" name="trial-last-name" placeholder="Last name" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" name="trial-email" placeholder="Email" required />
              </label>
              <label>
                <span>Preferred date</span>
                <input
                  type="date"
                  name="trial-date"
                  min={minDate}
                  value={trialDate}
                  onChange={(event) => {
                    setTrialDate(event.target.value)
                    setTrialFeedback('')
                  }}
                  required
                />
              </label>
              <label>
                <span>Time slot</span>
                <select
                  name="trial-time"
                  value={trialTime}
                  onChange={(event) => {
                    setTrialTime(event.target.value)
                    setTrialFeedback('')
                  }}
                  disabled={!slotOptions.length}
                  required
                >
                  <option value="">
                    {trialDate ? 'Select a time' : 'Pick a date first'}
                  </option>
                  {slotOptions.map((slot) => (
                    <option value={slot} key={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
              {trialDate && !slotOptions.length ? (
                <p className="booking-unavailable">No trial classes on Sundays.</p>
              ) : null}
              <button className="button" type="submit">
                Request Trial
              </button>
              {trialFeedback ? <p className="booking-feedback">{trialFeedback}</p> : null}
              <small>Form is a placeholder. Connect it to your email or backend service.</small>
            </form>
          </div>
        </div>
      </section>
      <Lightbox image={image} onClose={close} />
    </>
  )
}

export default Home
