import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import useReveal from '../hooks/useReveal'

const Layout = () => {
  const location = useLocation()
  const dragState = useRef({
    active: false,
    moved: false,
    startX: 0,
    ignoreClick: false,
    latestRatio: 0,
  })
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }
    const stored = window.localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useReveal(location.pathname)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (location.hash) {
        const targetId = location.hash.slice(1)
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }, 0)

    return () => clearTimeout(timeout)
  }, [location])

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const setThumbPosition = (target: HTMLButtonElement, ratio: number) => {
    const thumbPadding = 4
    const thumb = target.querySelector<HTMLElement>('.theme-toggle-thumb')
    const thumbWidth = thumb?.offsetWidth ?? 26
    const trackWidth = Math.max(0, target.clientWidth - thumbWidth - thumbPadding * 2)
    const clamped = Math.min(Math.max(ratio, 0), 1)
    target.style.setProperty('--thumb-x', `${clamped * trackWidth}px`)
    return clamped
  }

  const getRatioFromPointer = (target: HTMLButtonElement, clientX: number) => {
    const thumbPadding = 4
    const thumb = target.querySelector<HTMLElement>('.theme-toggle-thumb')
    const thumbWidth = thumb?.offsetWidth ?? 26
    const rect = target.getBoundingClientRect()
    const trackWidth = Math.max(1, rect.width - thumbWidth - thumbPadding * 2)
    const relativeX = clientX - rect.left - thumbPadding - thumbWidth / 2
    return relativeX / trackWidth
  }

  useEffect(() => {
    if (!toggleRef.current) {
      return
    }
    setThumbPosition(toggleRef.current, theme === 'dark' ? 1 : 0)
  }, [theme])

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }
    dragState.current.active = true
    dragState.current.moved = false
    dragState.current.startX = event.clientX
    dragState.current.ignoreClick = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragState.current.active) {
      return
    }
    if (Math.abs(event.clientX - dragState.current.startX) > 3) {
      dragState.current.moved = true
      const ratio = getRatioFromPointer(event.currentTarget, event.clientX)
      dragState.current.latestRatio = setThumbPosition(event.currentTarget, ratio)
    }
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragState.current.active) {
      return
    }
    dragState.current.active = false
    event.currentTarget.releasePointerCapture(event.pointerId)

    if (dragState.current.moved) {
      dragState.current.ignoreClick = true
      const ratio = getRatioFromPointer(event.currentTarget, event.clientX)
      setTheme(ratio >= 0.5 ? 'dark' : 'light')
      setTimeout(() => {
        dragState.current.ignoreClick = false
      }, 0)
      return
    }
  }

  const handlePointerCancel = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragState.current.active) {
      return
    }
    dragState.current.active = false
    dragState.current.ignoreClick = false
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="logo" to="/">
            <img
              className="logo-img logo-img--light"
              src="/assets/images/logo.png"
              alt="Evergreen Wushu logo"
            />
            <img
              className="logo-img logo-img--dark"
              src="/assets/images/logo-dark.png"
              alt="Evergreen Wushu logo"
            />
          </Link>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Home
            </NavLink>
            <NavLink to="/classes" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Classes
            </NavLink>
            <NavLink
              to="/instructors"
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              Masters/Instructors
            </NavLink>
            <NavLink to="/schedule" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Schedule
            </NavLink>
            <NavLink to="/programs" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Programs
            </NavLink>
            <NavLink
              to="/summer-camp"
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              Summer Camp
            </NavLink>
            <Link to="/#contact">Contact</Link>
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              ref={toggleRef}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => {
                if (dragState.current.ignoreClick) {
                  dragState.current.ignoreClick = false
                  return
                }
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            >
              <span className="theme-toggle-icon theme-toggle-icon--sun" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2.2v2.4M12 19.4v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.2 12h2.4M19.4 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
                </svg>
              </span>
              <span className="theme-toggle-icon theme-toggle-icon--moon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                  <defs>
                    <mask id="moon-cutout-mask">
                      <rect width="24" height="24" fill="white" />
                      <circle cx="15" cy="9" r="6" fill="black" />
                    </mask>
                  </defs>
                  <circle cx="10.5" cy="12" r="7" mask="url(#moon-cutout-mask)" />
                </svg>
              </span>
              <span className="theme-toggle-thumb" aria-hidden="true" />
            </button>
            <Link className="button small" to="/#contact">
              Book Free Trial
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="container footer">
        <span>Evergreen Wushu</span>
        <span>info@evergreenwushu.com</span>
        <span>408.505.8809</span>
      </footer>
    </div>
  )
}

export default Layout
