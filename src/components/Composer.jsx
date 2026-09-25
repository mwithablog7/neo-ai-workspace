import { useEffect, useRef } from 'react'
import { MODES } from '../engine/neoEngine'
import { IconAsk, IconAnalyze, IconPlan, IconCreate, IconArrow, IconAlert } from './icons'

const QUICK_ACTIONS = [
  { id: 'ask', label: 'Ask NEO', Icon: IconAsk },
  { id: 'analyze', label: 'Analyze', Icon: IconAnalyze },
  { id: 'plan', label: 'Plan', Icon: IconPlan },
  { id: 'create', label: 'Create', Icon: IconCreate },
]

const MAX_LEN = 600

export default function Composer({
  value,
  mode,
  error,
  busy,
  projectLabel,
  onChange,
  onModeChange,
  onSubmit,
  inputRef,
}) {
  const formRef = useRef(null)

  // Keep the textarea auto-growing without fighting the user's typing.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 260)}px`
  }, [value, inputRef])

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <form
      ref={formRef}
      className="composer"
      onSubmit={handleSubmit}
      noValidate
      aria-label="NEO assistant"
    >
      <div className="composer__top">
        <span className="composer__mode-label" id="mode-label">
          Mode
        </span>
        <div className="composer__modes" role="group" aria-labelledby="mode-label">
          {QUICK_ACTIONS.map(({ id, label, Icon }) => {
            const active = mode === id
            return (
              <button
                key={id}
                type="button"
                className={`qa ${active ? 'qa--active' : ''}`}
                aria-pressed={active}
                onClick={() => onModeChange(id)}
              >
                <Icon className="qa__icon" />
                <span className="qa__label">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <label className="sr-only" htmlFor="neo-input">
        What are you working on?
      </label>
      <textarea
        id="neo-input"
        ref={inputRef}
        className={`composer__input ${error ? 'composer__input--error' : ''}`}
        placeholder={MODES[mode].placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, MAX_LEN))}
        onKeyDown={handleKeyDown}
        rows={2}
        maxLength={MAX_LEN}
        spellCheck="false"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'neo-error neo-hint' : 'neo-hint'}
        disabled={busy}
      />

      {error ? (
        <p className="composer__error" id="neo-error" role="alert">
          <IconAlert className="composer__error-icon" />
          <span>{error}</span>
        </p>
      ) : null}

      <div className="composer__bar">
        <p className="composer__hint" id="neo-hint">
          Turn a question, idea, problem, or goal into your next clear action.
          {projectLabel ? (
            <span className="composer__context">
              {' '}
              Working in: <strong>{projectLabel}</strong>
            </span>
          ) : null}
        </p>
        <div className="composer__actions">
          <span className="composer__count" aria-hidden="true">
            {value.length}/{MAX_LEN}
          </span>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            <span>{busy ? 'Thinking…' : 'Ask NEO'}</span>
            <IconArrow className="btn__icon" />
          </button>
        </div>
      </div>

      <p className="composer__assist">
        Press <kbd>Enter</kbd> to send · <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line
      </p>
    </form>
  )
}
