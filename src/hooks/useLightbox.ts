import { useCallback, useState } from 'react'

export type LightboxImage = {
  src: string
  alt: string
  caption?: string
}

const useLightbox = () => {
  const [image, setImage] = useState<LightboxImage | null>(null)

  const open = useCallback((src: string, alt: string, caption?: string) => {
    setImage({ src, alt, caption })
  }, [])

  const close = useCallback(() => {
    setImage(null)
  }, [])

  return { image, open, close }
}

export default useLightbox
