import { useEffect } from 'react'
import type { LightboxImage } from '../hooks/useLightbox'

type LightboxProps = {
  image: LightboxImage | null
  onClose: () => void
}

const Lightbox = ({ image, onClose }: LightboxProps) => {
  useEffect(() => {
    if (!image) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.classList.add('lightbox-open')
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('lightbox-open')
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [image, onClose])

  if (!image) {
    return null
  }

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded image"
      onClick={onClose}
    >
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="lightbox-close" onClick={onClose}>
          Close
        </button>
        <img src={image.src} alt={image.alt} />
        {image.caption ? (
          <div className="lightbox-meta">
            <h3 className="lightbox-title">{image.alt}</h3>
            <p className="lightbox-caption">{image.caption}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Lightbox
