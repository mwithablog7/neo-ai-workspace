import { MODES } from '../engine/neoEngine'
import { IconSpark } from './icons'

// Structured NEO answer: What I'm seeing / What to check / Next action / Why.
export default function ResponseCard({ response, onFollowUp }) {
  if (!response) return null

  const checksSection = response.sections.find((s) => s.key === 'checks')
  const actionSection = response.sections.find((s) => s.key === 'action')

  return (
    <section className="response" aria-label="NEO response">
      <header className="response__head">
        <span className="response__badge">
          <IconSpark className="response__badge-icon" />
          NEO response
        </span>
        <div className="response__meta">
          <span className="chip">{MODES[response.mode].label}</span>
          <span className="chip chip--quiet">{response.topicLabel}</span>
          {response.projectName ? (
            <span className="chip chip--quiet">Working in: {response.projectName}</span>
          ) : null}
        </div>
      </header>

      <blockquote className="response__quote">
        <span className="response__quote-label">You asked</span>
        <p>{response.snippet}</p>
        {response.truncated ? (
          <small className="response__truncated">
            Long input — NEO read the first 900 characters.
          </small>
        ) : null}
      </blockquote>

      <div className="response__grid">
        {response.sections.map((section) => (
          <section
            key={section.key}
            className={`rcard rcard--${section.key} ${
              section.key === 'action' ? 'rcard--accent' : ''
            }`}
            aria-label={section.title}
          >
            <h3 className="rcard__title">{section.title}</h3>
            {section.list ? (
              <ol className="rcard__list">
                {section.list.map((item, index) => (
                  <li key={item}>
                    <span className="rcard__num" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="rcard__body">{section.body}</p>
            )}
            {section.key === 'action' ? (
              <p className="rcard__timebox">
                Timebox: <strong>{response.timebox}</strong>
              </p>
            ) : null}
          </section>
        ))}
      </div>

      {response.followUps?.length ? (
        <footer className="response__followups">
          <span className="response__followups-label">Keep going</span>
          <div className="response__followups-row">
            {response.followUps.map((text) => (
              <button
                key={text}
                type="button"
                className="chip chip--button"
                onClick={() => onFollowUp(text)}
              >
                {text}
              </button>
            ))}
          </div>
        </footer>
      ) : null}
    </section>
  )
}
