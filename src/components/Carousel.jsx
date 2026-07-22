import { useState } from 'react'

// Index-based slide track (React port of the design's [data-carousel]).
// `slides` is an array of { node, caption }.
// `variant="phone"` renders a portrait, phone-shaped frame for mobile screenshots
// so a vertical image fills it edge-to-edge (no pillarbox bars).
export default function Carousel({ slides, variant }) {
  const [i, setI] = useState(0)
  const count = slides.length
  const solo = count < 2
  const go = (n) => setI((n + count) % count)

  const caption = slides[i]?.caption || ''
  const capText = count > 1
    ? `0${i + 1} / 0${count}${caption ? '  ·  ' + caption : ''}`
    : caption

  return (
    <>
      <div className={`carousel${variant === 'phone' ? ' phone' : ''}${solo ? ' solo' : ''}`}>
        <div className="carousel-viewport">
          <div className="carousel-track" style={{ transform: `translateX(${-i * 100}%)` }}>
            {slides.map((s, k) => (
              <div className="cslide" key={k}>{s.node}</div>
            ))}
          </div>
        </div>
        <button className="carousel-nav cprev" type="button" aria-label="Previous" onClick={() => go(i - 1)}>&#8249;</button>
        <button className="carousel-nav cnext" type="button" aria-label="Next" onClick={() => go(i + 1)}>&#8250;</button>
        <div className="carousel-dots">
          {slides.map((s, k) => (
            <button
              key={k}
              className="cdot"
              type="button"
              aria-label={`Slide ${k + 1}`}
              aria-current={k === i ? 'true' : 'false'}
              onClick={() => go(k)}
            />
          ))}
        </div>
      </div>
      <p className="carousel-cap">{capText}</p>
    </>
  )
}
