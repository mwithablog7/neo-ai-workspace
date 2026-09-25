import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Logo from './components/Logo'
import Composer from './components/Composer'
import ResponseCard from './components/ResponseCard'
import ProjectCard from './components/ProjectCard'
import ReachChart from './components/ReachChart'
import {
  IconHome,
  IconFolder,
  IconChart,
  IconArrow,
  IconSpark,
  IconCheck,
} from './components/icons'
import { PROJECTS, RECENT_ACTIVITY, getProject } from './data/projects'
import { STATS, INSIGHT, WEEKS, formatCompact } from './data/analytics'
import {
  generateResponse,
  inferMode,
  starterForMode,
  validateInput,
} from './engine/neoEngine'

const VIEWS = ['home', 'projects', 'analytics']

const NAV = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'projects', label: 'Projects', Icon: IconFolder },
  { id: 'analytics', label: 'Analytics', Icon: IconChart },
]

const EXAMPLES = [
  'My social media engagement dropped this month. What should I investigate?',
  'I need to organize a university project.',
  'Give me three ideas for a social media campaign.',
]

function readHashView() {
  const raw = window.location.hash.replace('#', '')
  return VIEWS.includes(raw) ? raw : 'home'
}

export default function App() {
  const [view, setView] = useState(readHashView)
  const [mode, setMode] = useState('ask')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [response, setResponse] = useState(null)
  const [projectId, setProjectId] = useState('marketing-campaign')

  const inputRef = useRef(null)
  const responseRef = useRef(null)
  const busyRef = useRef(false)
  // True only when the user explicitly picked a quick action (or an explicit
  // mode button). An inferred mode is reflected in the UI but never sticks —
  // the next free-form input gets its intent re-inferred from scratch.
  const explicitMode = useRef(false)
  const timers = useRef([])

  const project = useMemo(() => getProject(projectId), [projectId])

  // Keep the URL hash in sync so refresh lands on the same view.
  useEffect(() => {
    const next = view === 'home' ? '#' : `#${view}`
    if (window.location.hash !== next && !(view === 'home' && !window.location.hash)) {
      window.history.replaceState(null, '', next)
    }
  }, [view])

  // Respond to browser back/forward between views.
  useEffect(() => {
    function onHashChange() {
      setView(readHashView())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Clean up any pending timers on unmount.
  useEffect(() => {
    const list = timers.current
    return () => list.forEach(clearTimeout)
  }, [])

  // Always land at the top when the view changes — running after render,
  // so it works even when the previous view was scrolled down.
  const firstView = useRef(true)
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false
      return
    }
    window.scrollTo(0, 0)
  }, [view])

  const focusInput = useCallback((caret = 'end') => {
    const el = inputRef.current
    if (!el) return
    el.focus({ preventScroll: true })
    const pos = caret === 'start' ? 0 : el.value.length
    try {
      el.setSelectionRange(pos, pos)
    } catch {
      /* selection unsupported — ignore */
    }
  }, [])

  const scrollToResponse = useCallback(() => {
    requestAnimationFrame(() => {
      responseRef.current?.scrollIntoView({ block: 'nearest' })
    })
  }, [])

  const submit = useCallback(() => {
    if (busyRef.current) return

    const check = validateInput(input)
    if (!check.ok) {
      setError(check.message)
      setResponse(null)
      focusInput()
      return
    }

    setError('')
    setBusy(true)
    busyRef.current = true

    // If the user didn't pick a mode explicitly, infer intent from their words
    // ("Plan it" → Plan) and reflect it in the quick-action state. "Ask NEO"
    // always infers, so picking it never freezes the mode.
    const effectiveMode =
      explicitMode.current && mode !== 'ask' ? mode : inferMode(check.value)
    if (effectiveMode !== mode) setMode(effectiveMode)

    // Small, deliberate pause so the interaction feels like thinking —
    // capped low to stay snappy, and guarded against double submits.
    const t = setTimeout(() => {
      const result = generateResponse({
        input: check.value,
        mode: effectiveMode,
        projectId: project?.id || null,
        projectName: project?.name || null,
      })
      setResponse(result)
      setBusy(false)
      busyRef.current = false
      scrollToResponse()
    }, 260)
    timers.current.push(t)
  }, [input, mode, project, focusInput, scrollToResponse])

  const handleModeChange = useCallback(
    (nextMode) => {
      explicitMode.current = true
      setMode(nextMode)
      setError('')
      setView('home')

      // Populate a useful starting prompt for this mode + active project.
      const starter = starterForMode(nextMode, project?.id, project?.starters)
      const looksLikeOurs = !input.trim() || input === starter
      if (looksLikeOurs) setInput(starter)
      focusInput()
    },
    [project, input, focusInput],
  )

  const handleSelectProject = useCallback(
    (id) => {
      // Re-selecting keeps a project active — the workspace always has context.
      // If the composer is showing the old project's auto-filled starter,
      // swap it for the new project's starter so the prompt never goes stale.
      const prev = project
      if (prev && input === starterForMode(mode, prev.id, prev.starters)) {
        const next = getProject(id)
        setInput(starterForMode(mode, next?.id, next?.starters))
      }
      setProjectId(id)
    },
    [project, input, mode],
  )

  const openProject = useCallback((id) => {
    setProjectId(id)
    setView('projects')
  }, [])

  const goto = useCallback((next) => {
    setView(next)
  }, [])

  // Follow-up submits a canned prompt directly (input state would lag a submit call).
  const handleFollowUpSafe = useCallback(
    (text) => {
      if (busyRef.current) return
      const check = validateInput(text)
      if (!check.ok) return
      setInput(text)
      setError('')
      setBusy(true)
      busyRef.current = true
      const effectiveMode =
        explicitMode.current && mode !== 'ask' ? mode : inferMode(text)
      if (effectiveMode !== mode) setMode(effectiveMode)
      const t = setTimeout(() => {
        const result = generateResponse({
          input: check.value,
          mode: effectiveMode,
          projectId: project?.id || null,
          projectName: project?.name || null,
        })
        setResponse(result)
        setBusy(false)
        busyRef.current = false
        scrollToResponse()
      }, 260)
      timers.current.push(t)
    },
    [mode, project, scrollToResponse],
  )

  const handleAskInsight = useCallback(() => {
    explicitMode.current = true
    setMode('analyze')
    setView('home')
    setInput(INSIGHT.ask)
    setError('')
    setTimeout(() => focusInput('end'), 60)
  }, [focusInput])

  const handleExample = useCallback(
    (text) => {
      setInput(text)
      setError('')
      focusInput('end')
    },
    [focusInput],
  )

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="topbar">
        <div className="topbar__inner">
          <button
            type="button"
            className="brand"
            onClick={() => goto('home')}
            aria-label="NEO home"
          >
            <Logo tagline />
          </button>

          <nav className="nav" aria-label="Primary">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={`nav__item ${view === id ? 'nav__item--active' : ''}`}
                aria-current={view === id ? 'page' : undefined}
                onClick={() => goto(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="btn btn--ghost topbar__cta"
            onClick={() => {
              setView('home')
              setTimeout(() => focusInput('end'), 60)
            }}
          >
            <IconSpark className="btn__icon" />
            Ask NEO
          </button>
        </div>
      </header>

      <main id="main" className="main" tabIndex={-1}>
        {view === 'home' ? (
          <div className="shell">
            <section className="hero">
              <p className="eyebrow">Personal AI workspace</p>
              <h1 className="hero__title">
                NEO turns messy thoughts into{' '}
                <span className="hero__accent">clear next actions.</span>
              </h1>
              <p className="hero__sub">
                Welcome back. Ask a question, drop a problem, or start from a project —
                NEO gives you a structured read and one move you can make today.
              </p>
            </section>

            <section className="workspace" aria-label="NEO workspace">
              <Composer
                value={input}
                mode={mode}
                error={error}
                busy={busy}
                projectLabel={project?.name}
                onChange={(v) => {
                  setInput(v)
                  if (error) setError('')
                }}
                onModeChange={handleModeChange}
                onSubmit={submit}
                inputRef={inputRef}
              />

              {response ? (
                <div ref={responseRef}>
                  <ResponseCard response={response} onFollowUp={handleFollowUpSafe} />
                </div>
              ) : (
                <div className="examples">
                  <p className="examples__label">Try one of these</p>
                  <div className="examples__row">
                    {EXAMPLES.map((text) => (
                      <button
                        key={text}
                        type="button"
                        className="chip chip--button"
                        onClick={() => handleExample(text)}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="section" aria-labelledby="home-projects-title">
              <div className="section__head">
                <div>
                  <h2 className="section__title" id="home-projects-title">
                    Projects
                  </h2>
                  <p className="section__sub">
                    Selecting a project sets the context NEO works from.
                  </p>
                </div>
                <button
                  type="button"
                  className="link"
                  onClick={() => goto('projects')}
                >
                  Manage projects <IconArrow className="link__icon" />
                </button>
              </div>

              <div className="pcard-grid">
                {PROJECTS.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    selected={p.id === projectId}
                    onSelect={handleSelectProject}
                  />
                ))}
              </div>

              {project ? (
                <div className="context">
                  <div className="context__head">
                    <h3 className="context__name">{project.name}</h3>
                    <span className="chip chip--accent">
                      <IconCheck className="chip__icon" /> Active context
                    </span>
                  </div>
                  <p className="context__goal">
                    <span className="context__label">Goal</span> {project.goal}
                  </p>
                  <p className="context__text">{project.context}</p>
                  <div className="context__cols">
                    <div>
                      <h4 className="context__label">Recent activity</h4>
                      <ul className="context__list">
                        {project.activity.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="context__label">Relevant next actions</h4>
                      <ul className="context__list context__list--tasks">
                        {project.tasks.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button type="button" className="btn btn--ghost" onClick={() => openProject(project.id)}>
                    Open project <IconArrow className="btn__icon" />
                  </button>
                </div>
              ) : null}
            </section>

            <section className="section" aria-labelledby="home-activity-title">
              <div className="section__head">
                <div>
                  <h2 className="section__title" id="home-activity-title">
                    Recent activity
                  </h2>
                  <p className="section__sub">
                    The latest moves across your projects — sample demo data.
                  </p>
                </div>
                <button type="button" className="link" onClick={() => goto('projects')}>
                  View projects <IconArrow className="link__icon" />
                </button>
              </div>
              <ul className="feed">
                {RECENT_ACTIVITY.map((item) => {
                  const owner = getProject(item.projectId)
                  const isActive = item.projectId === projectId
                  return (
                    <li
                      key={item.id}
                      className={`feed__item ${isActive ? 'feed__item--active' : ''}`}
                    >
                      <button
                        type="button"
                        className="feed__btn"
                        title="Work in this project"
                        onClick={() => handleSelectProject(item.projectId)}
                      >
                        <span className="feed__text">{item.text}</span>
                        <span className="feed__meta">
                          <span className="feed__project">
                            {isActive ? (
                              <IconCheck className="feed__check" />
                            ) : null}
                            {owner?.name}
                          </span>
                          <span className="feed__time">{item.time}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="section" aria-labelledby="home-demo-title">
              <div className="section__head">
                <div>
                  <h2 className="section__title" id="home-demo-title">
                    Demo analytics
                  </h2>
                  <p className="section__sub">
                    Illustrative sample data — clearly labelled, never live.
                  </p>
                </div>
                <button
                  type="button"
                  className="link"
                  onClick={() => goto('analytics')}
                >
                  Open analytics <IconArrow className="link__icon" />
                </button>
              </div>
              <div className="stat-grid stat-grid--compact">
                {STATS.slice(0, 4).map((s) => (
                  <div className="stat" key={s.id}>
                    <p className="stat__label">{s.label}</p>
                    <p className="stat__value">{s.value}</p>
                    <p className={`stat__delta stat__delta--${s.trend}`}>{s.delta}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {view === 'projects' ? (
          <div className="shell">
            <section className="hero hero--slim">
              <p className="eyebrow">Workspace</p>
              <h1 className="hero__title">Projects</h1>
              <p className="hero__sub">
                Three active projects. Pick one — NEO’s answers, prompts, and context all
                follow your selection.
              </p>
            </section>

            <div className="pcard-grid pcard-grid--wide">
              {PROJECTS.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  selected={p.id === projectId}
                  onSelect={handleSelectProject}
                />
              ))}
            </div>

            {project ? (
              <section className="context context--page" aria-label="Selected project detail">
                <div className="context__head">
                  <h2 className="context__name context__name--lg">{project.name}</h2>
                  <span className="chip chip--accent">
                    <IconCheck className="chip__icon" /> Active context
                  </span>
                </div>
                <p className="context__goal">
                  <span className="context__label">Goal</span> {project.goal}
                </p>
                <p className="context__text">{project.context}</p>
                <div className="context__cols">
                  <div>
                    <h3 className="context__label">Recent activity</h3>
                    <ul className="context__list">
                      {project.activity.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="context__label">Relevant next actions</h3>
                    <ul className="context__list context__list--tasks">
                      {project.tasks.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="context__actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => {
                      explicitMode.current = true
                      setMode('plan')
                      setInput(project.starters.plan)
                      setView('home')
                      setError('')
                      setTimeout(() => focusInput('end'), 60)
                    }}
                  >
                    Plan this project <IconArrow className="btn__icon" />
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      explicitMode.current = true
                      setMode('analyze')
                      setInput(project.starters.analyze)
                      setView('home')
                      setError('')
                      setTimeout(() => focusInput('end'), 60)
                    }}
                  >
                    Analyze this project <IconArrow className="btn__icon" />
                  </button>
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        {view === 'analytics' ? (
          <div className="shell">
            <section className="hero hero--slim">
              <p className="eyebrow">Marketing analytics</p>
              <h1 className="hero__title">Demo analytics</h1>
              <p className="hero__sub">
                Eight weeks of illustrative sample data. This is demo content — not a
                live account connection.
              </p>
              <span className="badge-demo">Demo data · sample only</span>
            </section>

            <div className="stat-grid">
              {STATS.map((s) => (
                <div className="stat" key={s.id}>
                  <p className="stat__label">{s.label}</p>
                  <p className="stat__value">{s.value}</p>
                  <p className={`stat__delta stat__delta--${s.trend}`}>
                    <span aria-hidden="true">
                      {s.trend === 'down' ? '↓' : s.trend === 'up' ? '↑' : '→'}
                    </span>{' '}
                    {s.delta}
                  </p>
                  <p className="stat__note">{s.note}</p>
                  {s.mini ? (
                    <div className="stat__mini" aria-hidden="true">
                      {s.mini.map((v, i) => (
                        <span
                          key={i}
                          style={{ height: `${(v / 6) * 100}%` }}
                          title={`${WEEKS[i].label}: ${v} posts`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <section className="panel" aria-labelledby="chart-title">
              <div className="panel__head">
                <h2 className="panel__title" id="chart-title">
                  Reach &amp; engagement, week by week
                </h2>
                <span className="chip chip--quiet">Sample data</span>
              </div>
              <ReachChart />
            </section>

            <section className="insight" aria-labelledby="insight-title">
              <div className="insight__head">
                <IconSpark className="insight__icon" />
                <h2 className="insight__title" id="insight-title">
                  NEO Insight
                </h2>
              </div>
              <h3 className="insight__headline">{INSIGHT.title}</h3>
              <p className="insight__body">{INSIGHT.body}</p>
              <div className="insight__facts">
                <span>
                  Reach <strong>−26%</strong>
                </span>
                <span>
                  Engagement <strong>+0.2 pp</strong>
                </span>
                <span>
                  Posts <strong>22 → 13</strong>
                </span>
              </div>
              <button type="button" className="btn btn--primary" onClick={handleAskInsight}>
                Investigate this with NEO <IconArrow className="btn__icon" />
              </button>
            </section>

            <details className="table-details">
              <summary>View sample data as a table</summary>
              <div className="table-wrap">
                <table className="table">
                  <caption className="sr-only">
                    Weekly demo metrics: reach, engagement rate, followers, posts published
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Week</th>
                      <th scope="col">Reach</th>
                      <th scope="col">Engagement</th>
                      <th scope="col">Followers</th>
                      <th scope="col">Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WEEKS.map((w) => (
                      <tr key={w.label}>
                        <th scope="row">{w.full}</th>
                        <td>{w.reach.toLocaleString('en-US')}</td>
                        <td>{w.engagement}%</td>
                        <td>{w.followers.toLocaleString('en-US')}</td>
                        <td>{w.posts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        ) : null}
      </main>

      <nav className="tabbar" aria-label="Primary mobile">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`tabbar__item ${view === id ? 'tabbar__item--active' : ''}`}
            aria-current={view === id ? 'page' : undefined}
            onClick={() => goto(id)}
          >
            <Icon className="tabbar__icon" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <footer className="footer">
        <div className="footer__inner">
          <Logo size="sm" />
          <p className="footer__tag">Think clearly. Move forward.</p>
          <p className="footer__note">
            NEO prototype · all projects, activity, and analytics on this page are
            sample demo data.
          </p>
        </div>
      </footer>
    </div>
  )
}
