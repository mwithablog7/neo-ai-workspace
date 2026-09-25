import { WEEKS, formatCompact } from '../data/analytics'

// Lightweight chart: engagement-rate line drawn over weekly reach bars.
// Pure HTML/CSS + one inline SVG polyline — resizes with the container,
// no chart library, no canvas, no network.
export default function ReachChart() {
  const maxReach = Math.max(...WEEKS.map((w) => w.reach))
  const minEng = 4.0
  const maxEng = 4.8

  // Map engagement to percentage heights for the polyline (in a 0–100 box).
  const points = WEEKS.map((w, i) => {
    const x = ((i + 0.5) / WEEKS.length) * 100
    const y = 100 - ((w.engagement - minEng) / (maxEng - minEng)) * 100
    return { x, y, w }
  })
  const polyline = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

  return (
    <figure className="chart" role="group" aria-label="Weekly reach and engagement rate, demo data">
      <div className="chart__legend" aria-hidden="true">
        <span className="chart__legend-item">
          <span className="chart__swatch chart__swatch--bar" /> Reach (per week)
        </span>
        <span className="chart__legend-item">
          <span className="chart__swatch chart__swatch--line" /> Engagement rate (%)
        </span>
      </div>

      <div className="chart__plot">
        <div className="chart__grid" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="chart__bars">
          {WEEKS.map((w) => (
            <div className="chart__bar-col" key={w.label}>
              <span className="chart__bar-value">{formatCompact(w.reach)}</span>
              <div
                className="chart__bar"
                style={{ height: `${(w.reach / maxReach) * 100}%` }}
                title={`${w.full}: ${formatCompact(w.reach)} reach, ${w.engagement}% engagement, ${w.posts} posts`}
              />
            </div>
          ))}
        </div>

        <svg
          className="chart__line"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <polyline
            points={polyline}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="chart__dots" aria-hidden="true">
          {points.map((p) => (
            <span
              key={p.w.label}
              className="chart__dot"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              title={`${p.w.engagement}% engagement`}
            />
          ))}
        </div>
      </div>

      <div className="chart__xlabels" aria-hidden="true">
        {WEEKS.map((w) => (
          <span key={w.label}>{w.label}</span>
        ))}
      </div>

      <figcaption className="chart__caption">
        Sample data · last 8 weeks. Bars show weekly reach; the line shows engagement rate
        (4.0–4.8% scale).
      </figcaption>
    </figure>
  )
}
