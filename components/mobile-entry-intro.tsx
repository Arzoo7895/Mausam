'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

const taglines = [
  'Your Personalized Weather.',
  'Your Weather, Just for You.',
  'Know Before You Go.',
  'Weather Intelligence, Made Personal.',
]

export function MobileEntryIntro() {
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const taglineTimer = window.setInterval(() => {
      setTaglineIndex((index) => (index + 1) % taglines.length)
    }, 1500)
    return () => window.clearInterval(taglineTimer)
  }, [])

  function enterAccount() {
    setLeaving(true)
    window.setTimeout(() => {
      window.location.assign('/auth/sign-up')
    }, 520)
  }

  return (
    <section className={`mobile-entry ${leaving ? 'mobile-entry--leaving' : ''}`} aria-label="Mausam AI introduction">
      <div className="entry-atmosphere" aria-hidden="true">
        <span className="atmosphere-particle particle-one" />
        <span className="atmosphere-particle particle-two" />
        <span className="atmosphere-particle particle-three" />
        <span className="atmosphere-rain rain-one" />
        <span className="atmosphere-rain rain-two" />
        <span className="atmosphere-rain rain-three" />
      </div>

      <div className="drop" aria-hidden="true" />
      <div className="ripple ripple-one" aria-hidden="true" />
      <div className="ripple ripple-two" aria-hidden="true" />
      <div className="ripple ripple-three" aria-hidden="true" />

      <div className="entry-content">
        <div className="logo-lockup">
          <h1 className="entry-logo" aria-label="Mausam AI">
            {'MAUSAM AI'.split('').map((letter, index) => (
              <span key={`${letter}-${index}`} style={{ '--letter-index': index } as React.CSSProperties}>
                {letter === ' ' ? '\u00a0' : letter}
              </span>
            ))}
          </h1>
        </div>
        <p className="entry-tagline" key={taglineIndex}>{taglines[taglineIndex]}</p>
      </div>

      <button className="entry-arrow" type="button" onClick={enterAccount} aria-label="Continue to Create Account">
        <ArrowRight strokeWidth={1.5} aria-hidden="true" />
      </button>
    </section>
  )
}

export { taglines }
