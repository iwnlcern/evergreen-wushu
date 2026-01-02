import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from '../components/Lightbox'
import useLightbox from '../hooks/useLightbox'

const SummerCamp = () => {
  const { image, open, close } = useLightbox()

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">2025 Summer Camp</div>
          <h1>Evergreen Wushu Summer Camp</h1>
          <p>
            Build confidence, agility, and friendships in a focused summer training program. See the
            flyer below for dates, pricing, and daily activities.
          </p>
        </div>
      </section>

      <section>
        <div className="container schedule-preview">
          <div className="reveal">
            <h2 className="section-title">Camp flyer</h2>
            <p className="section-subtitle">
              The flyer includes the full camp schedule, tuition, and registration details. Contact
              us if you have questions or want to reserve a spot.
            </p>
            <div className="cta" style={{ marginTop: '20px' }}>
              <Link className="button" to="/#contact">
                Contact to register
              </Link>
            </div>
          </div>
          <button
            type="button"
            className="image-button reveal"
            style={{ '--delay': '0.1s' } as CSSProperties}
            onClick={() =>
              open('/assets/images/summer-camp.jpg', 'Evergreen Wushu summer camp flyer')
            }
            aria-label="Expand summer camp flyer"
          >
            <img src="/assets/images/summer-camp.jpg" alt="Evergreen Wushu summer camp flyer" />
          </button>
        </div>
      </section>
      <Lightbox image={image} onClose={close} />
    </>
  )
}

export default SummerCamp
