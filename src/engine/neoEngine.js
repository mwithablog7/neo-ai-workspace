// NEO local response engine — no API keys, no network, no accounts.
// It classifies input by keyword scoring (topic) and intent (mode), then
// composes a structured, domain-specific answer: What I'm seeing /
// What to check / Next action / Why. Deterministic per input, varied across inputs.

export const MODES = {
  ask: {
    id: 'ask',
    label: 'Ask NEO',
    short: 'Ask',
    blurb: 'A clear read and one next step',
    placeholder: 'What are you working on?',
    timebox: '≈ 15 min',
    closer: '',
  },
  analyze: {
    id: 'analyze',
    label: 'Analyze',
    short: 'Analyze',
    blurb: 'Diagnose what the numbers are saying',
    placeholder: 'What should NEO analyze? e.g. why reach dropped this month…',
    timebox: '≈ 30 min',
    closer:
      'Diagnose before you act — change two things at once and you learn nothing from either.',
  },
  plan: {
    id: 'plan',
    label: 'Plan',
    short: 'Plan',
    blurb: 'Turn a goal into a sequenced week',
    placeholder: 'What do you need to plan? e.g. the next 7 days across two projects…',
    timebox: '≈ 15 min',
    closer: 'A plan you can start in the next hour beats a perfect one you start on Monday.',
  },
  create: {
    id: 'create',
    label: 'Create',
    short: 'Create',
    blurb: 'Draft, script, or shape an idea',
    placeholder: 'What should NEO help create? e.g. a launch post or case study intro…',
    timebox: '≈ 45 min',
    closer:
      'Momentum comes from a rough version you can improve — waiting for the right idea is how it stays imaginary.',
  },
}

const DEFAULT_STARTERS = {
  ask: 'What’s the fastest useful next step for my week right now?',
  analyze: 'Analyze why my Instagram reach dropped this month.',
  plan: 'Plan my next 7 days: three outcomes, blocked time, and one thing to cut.',
  create: 'Create a first draft for my portfolio case study: one idea, the hook, and the first three steps.',
}

// ---------------------------------------------------------------- topics
// Each topic: interpretation, 4 checks (3 are shown), one concrete action per
// mode, a "why", and follow-up suggestions the user can click.

const TOPICS = [
  {
    id: 'social',
    label: 'Social & distribution',
    keywords: [
      'instagram', 'reach', 'followers', 'engagement', 'tiktok', 'reels', 'reel',
      'algorithm', 'post', 'posts', 'posting', 'views', 'impressions', 'share',
      'shares', 'saves', 'social media', 'youtube', 'shorts', 'caption',
    ],
    seeing: [
      'This reads as a distribution problem, not a content-quality problem. Reach decides who sees the work; engagement decides what happens after — when one moves without the other, the break is upstream.',
      'A reach swing with steady engagement usually means the feed changed its mind about you, not that the audience did. Cadence, format mix, and timing move reach faster than craft does.',
    ],
    checks: [
      'Follower vs non-follower reach — if non-follower reach fell hardest, it’s distribution, not loyalty.',
      'Posting cadence and format mix for the same 4 weeks — volume and reel-vs-static ratio explain most swings.',
      'Saves, shares, and watch time per post — if these held steady, the content still works with fewer impressions.',
      'Your top 3 posts this month vs last — hooks, length, and posting time, side by side, for a concrete pattern.',
    ],
    actions: {
      ask: 'Pull your last 10 posts into a sheet with reach, saves, and format — 10 minutes — and sort by reach. The pattern will be visible before you change anything.',
      analyze: 'Compare follower vs non-follower reach for the last 8 weeks in one chart. Which line moved tells you whether to fix distribution or content.',
      plan: 'Run a one-week test: 3 posts, one variable changed (hook length), same time slots — then compare reach before touching strategy.',
      create: 'Remake your best-performing post in a new format today, keeping everything except the hook identical — a controlled re-test beats a new idea.',
    },
    why: [
      'Reach is a distribution signal; engagement is a quality signal. Treating a distribution problem like a quality problem means rewriting content that was never the issue.',
      'Platforms re-weight what they show constantly. Isolating volume, timing, and format tells you whether this is your work or the feed — and only one of those you can fix by making more.',
    ],
    followUps: [
      'Compare my reach vs engagement over the last 8 weeks',
      'Draft a 3-post test for next week',
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing & campaigns',
    keywords: [
      'marketing', 'campaign', 'ads', 'ad ', 'ctr', 'conversion', 'conversions',
      'funnel', 'email', 'open rate', 'landing page', 'audience', 'brand',
      'seo', 'keyword', 'positioning', 'copy', 'offer', 'traffic', 'acquisition',
      'cpa', 'roi', 'budget', 'targeting',
    ],
    seeing: [
      'Something between attention and action is leaking. The campaign runs, the numbers after the click don’t keep up — that’s a funnel problem with a specific location, not a vague underperformance.',
      'This looks less like a creative failure and more like a mismatch between who you’re reaching and what you’re asking them to do. Those need different fixes.',
    ],
    checks: [
      'Where the drop starts: impressions, CTR, or conversion — fix the first metric that moved, not the last one you noticed.',
      'Channel mix — did a low-intent source take share from search or referral this period?',
      'One variable at a time — creative, audience, offer, or landing page. If all changed at once, nothing is attributable.',
      'New vs returning visitors — a collapsing new-visitor rate points at the top of the funnel specifically.',
    ],
    actions: {
      ask: 'Rebuild the funnel for one week: impressions → clicks → conversions, one row per day. The first step that dips is where you look first.',
      analyze: 'Segment the last 14 days by channel and find the single largest drop-off step. Don’t touch budget until that step has a name.',
      plan: 'Pick one hypothesis (offer, audience, or page), write the one metric that proves it, and schedule a 7-day test window in the calendar today.',
      create: 'Rewrite the one weakest line in the path — headline, subject line, or CTA — with a specific number in it, and ship the variant this week.',
    },
    why: [
      'Funnels break at one step. Finding that step first prevents you from rewriting creative that was never the problem.',
      'A single measured change teaches you something; a redesign teaches you nothing you can repeat. Attribution is the whole job here.',
    ],
    followUps: [
      'Where would you start diagnosing this funnel?',
      'Draft a stronger CTA for this campaign',
    ],
  },
  {
    id: 'content',
    label: 'Content & ideas',
    keywords: [
      'idea', 'ideas', 'video', 'script', 'blog', 'newsletter', 'content',
      'creative', 'write', 'writing', 'draft', 'series', 'topics', 'brainstorm',
      'editorial', 'story', 'angle', 'hook', 'channel', 'publish',
    ],
    seeing: [
      'You have more raw material than a shape. The friction isn’t generating options — it’s deciding what this is for and who it’s for, which is a smaller, solvable decision.',
      'The idea isn’t stuck; it’s under-specified. Most content stalls before production because the audience and the takeaway are still plural.',
    ],
    checks: [
      'Who it’s for — name one real person. If you can’t, the piece will try to please everyone and land with no one.',
      'The single takeaway — if the piece argues three things, it will be remembered for none of them.',
      'Your last 10 posts ranked by saves and shares — what people keep tells you what to make next.',
      'Format fit — is this a carousel, a video, or a newsletter? Forcing it into the wrong format flattens it.',
    ],
    actions: {
      ask: 'Write one sentence: “This is for ___ and after seeing it they’ll ___.” If either blank is empty, that’s the actual task.',
      analyze: 'Rank your last 10 pieces by saves and shares, then name the one shared trait of the top three. That trait is your brief.',
      plan: 'Block 90 minutes: outline three pieces from your proven format — one draft, one scheduled, one held in reserve.',
      create: 'Write a rough 150-word draft of the core idea with no editing, and send it to one person who matches your audience today.',
    },
    why: [
      'Attention is decided in the first line, long before the idea is judged. Diagnosing hooks is faster than judging an entire body of work — and it compounds across everything you publish.',
      'Creators who iterate on one variable improve; creators who overhaul everything learn nothing. One change, one measurable result.',
    ],
    followUps: [
      'Turn this into a content series outline',
      'Give me 5 hooks for this idea',
    ],
  },
  {
    id: 'academic',
    label: 'Academic work',
    keywords: [
      'university', 'essay', 'thesis', 'exam', 'assignment', 'professor',
      'presentation', 'course', 'module', 'deadline', 'submit', 'citation',
      'referencing', 'research', 'dissertation', 'final project', 'supervisor',
      'revision', 'grade', 'marks', 'rubric', 'lecture',
    ],
    seeing: [
      'This is a scope problem wearing a time problem’s clothes. The deadline is fixed, so the only real variables are what gets cut and in what order — both are decisions you can make today.',
      'The stress here comes from the work being undifferentiated: everything is “the project,” so nothing is started. Splitting it into graded pieces is the intervention.',
    ],
    checks: [
      'The marking rubric — write down the four criteria and score your current draft against them before adding anything.',
      'Status by section: finished, started, untouched — then cut the smallest-value untouched item outright.',
      'Feedback loop — book supervisor or tutorial time now; a 20-minute review beats three days of guessing.',
      'The argument, not the word count — does each section open with a claim the evidence then proves?',
    ],
    actions: {
      ask: 'Take the rubric and your current draft, side by side, and mark every criterion green, amber, or red — 25 minutes. Red first, always.',
      plan: 'Map the remaining weeks backwards from submission: three work blocks, two feedback points, one buffer day, written on a single page.',
      create: 'Write the strongest section you already understand, badly, in 45 minutes — a rough argument is far easier to fix than a blank page.',
      analyze: 'List each section with its rubric weight and your confidence (1–5). Multiply them — the lowest product is where a grade is actually being lost.',
    },
    why: [
      'Rubrics define the grade. Time spent matching criteria is the highest-yield time available, and it’s finite — unlike re-reading notes.',
      'Three weeks is enough for three focused blocks and two rounds of sequencing the work. What separates a submitted project from a panicked one is order, not effort.',
    ],
    followUps: [
      'Plan my next 7 days to the submission date',
      'What’s the weakest section of this outline?',
    ],
  },
  {
    id: 'career',
    label: 'Career & applications',
    keywords: [
      'job', 'jobs', 'interview', 'cv', 'resume', 'portfolio', 'recruiter',
      'hiring', 'internship', 'application', 'linkedin', 'career', 'offer',
      'salary', 'networking', 'employer', 'role', 'hiring manager', 'referral',
    ],
    seeing: [
      'You’re optimising inside the application when outcomes are usually decided by positioning and proof — who sees you, and what they can verify in ten seconds.',
      'This behaves like a funnel, not a verdict. Funnels have measurable stages, and measurable stages have fixable steps.',
    ],
    checks: [
      'Where people drop off: profile views, replies, or callbacks — each failure point needs a different fix.',
      'The first six seconds of your CV or portfolio — role, proof, and one number should be visible without scrolling.',
      'Applications vs referrals — if referrals convert far better, the problem is channel, not credentials.',
      'Two dream role descriptions, side by side — extract the shared keywords and check your profile uses them naturally.',
    ],
    actions: {
      ask: 'Rewrite your three weakest CV bullets as achievement + metric + tool this week, then send the CV to one person in the role and ask what they’d cut.',
      analyze: 'Log your last 10 applications: sent, viewed, replied, source. The stage with the worst rate is the only thing worth fixing first.',
      plan: 'This week: 5 tailored applications, 2 referrals requested, 1 portfolio rewrite — blocked as three named calendar entries.',
      create: 'Draft a four-line intro message that names the company, the problem, and one relevant thing you’ve shipped. Send it to one human today.',
    },
    why: [
      'Hiring screens for signal density. The same experience, presented with clearer proof, changes callback rates more than adding another bullet ever will.',
      'Measuring the funnel shows where yield actually is, instead of sending more effort into the lowest-yield channel.',
    ],
    followUps: [
      'Rewrite one CV bullet as achievement + metric',
      'Plan a one-week job search sprint',
    ],
  },
  {
    id: 'plan',
    label: 'Planning & focus',
    keywords: [
      'plan', 'planning', 'schedule', 'time', 'overwhelmed', 'stuck', 'busy',
      'procrastinate', 'priorit', 'week', 'calendar', 'balance', 'routine',
      'focus', 'burnout', 'too much', 'deadline', 'manage', 'organise',
      'organize', 'steps', 'roadmap',
    ],
    seeing: [
      'The list isn’t too long so much as undifferentiated — everything carries the same weight, so nothing gets started. Priority is a decision, not a feeling.',
      'This is a capacity problem dressed as a motivation problem. You don’t need more drive; you need the week to have an order.',
    ],
    checks: [
      'Hard dates vs open-ended — put a real date on every item, including the ones you’ve been “meaning to” start.',
      'Genuine hours this week — count them, then plan to about 70% of them, not 100%.',
      'The one outcome that makes the week a win — if only one thing ships, which one changes the most?',
      'Energy mapping — deep work where you’re sharp, admin where you’re not; the calendar should match your brain.',
    ],
    actions: {
      ask: 'Write the week as one outcome, three supporting tasks, and a “not this week” list — then put the outcome in a 90-minute block before tomorrow’s first commitment.',
      analyze: 'Log where the last three days actually went in 30-minute resolution. The gap between intent and reality is usually one specific block.',
      plan: 'Pick the one outcome that matters, schedule three 90-minute focus blocks for it, and move everything else to a “not this week” list.',
      create: 'Start a 25-minute timer on the smallest visible piece and produce something rough — momentum beats planning at this point.',
    },
    why: [
      'Vague goals produce vague effort. Forcing the list down to one outcome is what makes the rest of the work calm instead of guilt-shaped.',
      'One protected focus block outperforms five interrupted ones. Protecting attention does more than adding tasks to a list.',
    ],
    followUps: [
      'Turn this into a 7-day plan with blocked time',
      'What should I cut from this week entirely?',
    ],
  },
  {
    id: 'launch',
    label: 'Product & launch',
    keywords: [
      'launch', 'product', 'mvp', 'pricing', 'customers', 'users', 'feedback',
      'beta', 'app', 'saas', 'feature', 'startup', 'build', 'ship', 'market',
      'validate', 'signup', 'sign-ups', 'onboarding', 'retention',
    ],
    seeing: [
      'You’re close enough to put something in front of people, which is worth more right now than another week of internal polish. The riskiest piece is the assumption, not the build.',
      'Early-stage work dies on untested assumptions, not execution. What you need from the next step is a fact you don’t already have.',
    ],
    checks: [
      'The riskiest assumption — what must be true for this to work, and what’s the cheapest test of it this week?',
      'Activation moment — do new users reach the “aha” step, or bounce before the product shows its value?',
      'Pricing signal — ask five target users what they’d pay before polishing anything. Their hesitation is data.',
      'A named channel for the first 100 users — three communities, twenty messages, one partner. “We’ll post about it” is not a channel.',
    ],
    actions: {
      ask: 'Ship the one-screen version to five real people this week and ask a single question: “What would stop you using this twice?” Record the answers verbatim.',
      analyze: 'Map sign-up → activation → return for the last cohort and find the largest single drop. That step is the product problem.',
      plan: 'Cut scope to what ships this week, write the one-sentence promise, and block two two-hour build sessions before announcing anything.',
      create: 'Write the launch note in 120 words: the problem, the shift, the invitation. Post it where your first twenty users already are.',
    },
    why: [
      'Five honest reactions beat five weeks of guessing what the market wants. Early feedback compounds; polish spent before it is spent blind.',
      'Smaller promises shipped on time create trust. At this stage trust is the currency — more than features, more than launch day.',
    ],
    followUps: [
      'What’s the riskiest assumption here?',
      'Draft a 120-word launch note',
    ],
  },
  {
    id: 'data',
    label: 'Data & metrics',
    keywords: [
      'data', 'metric', 'metrics', 'numbers', 'chart', 'dashboard', 'report',
      'trend', 'measure', 'kpi', 'roi', 'analy[sz]e', 'analy[sz]ing', 'correlation',
      'forecast', 'baseline', 'segment', 'drop', 'dropped', 'decline', 'fell',
      'growth', 'compare',
    ],
    seeing: [
      'There’s a signal in there mixed with noise from comparing unlike things. Same period, same segment, same definition first — then the number can speak.',
      'The chart moved; the open question is whether the measuring stick moved with it. Definitions and windows decide whether this is a finding or an artefact.',
    ],
    checks: [
      'Definition before dashboard — how exactly is each metric calculated, and did that definition change recently?',
      'Baseline and window — equal-length periods, same weekdays, or the trend will quietly lie to you.',
      'One segment that explains most of the move — split by channel, device, or new vs returning and find where it concentrates.',
      'Collection gaps — missing days, changed tags, or a tracking update can imitate a real decline perfectly.',
    ],
    actions: {
      ask: 'Write the sentence “X changed by Y% between A and B because Z” — if you can’t fill in Z, the next step is one more cut of the data, not a decision.',
      analyze: 'Rebuild the comparison with one metric, one segment, and two equal time windows before drawing any conclusion.',
      plan: 'Define the three metrics that actually answer the question, their source, and the weekly slot where you’ll review them.',
      create: 'Turn the finding into one chart with a single annotated turning point — the story is the annotation, not the axis.',
    },
    why: [
      'Numbers persuade only after the comparison is fair. Fixing the frame first prevents confidently wrong conclusions that cost a week to unwind.',
      'A dashboard you don’t trust is worse than no dashboard — it manufactures false certainty. Definitions first, stories second.',
    ],
    followUps: [
      'How should I cut this data first?',
      'Turn this into one clear chart',
    ],
  },
  {
    id: 'general',
    label: 'General',
    keywords: [],
    seeing: [
      'There are two things tangled here: what you want to be true, and what’s actually blocking it. Pulling them apart is the fastest honest start.',
      'This is still broad, which is fine — the useful move is converting a general worry into a testable question with a deadline on it.',
    ],
    checks: [
      'What “done” looks like — one sentence you could tick a box against.',
      'The constraint you’re assuming — time, skill, or permission. Which one is actually binding?',
      'Who has already solved this — one message to a person is often faster than three more hours of research.',
      'The smallest reversible step — what can you try this week that’s cheap to undo?',
    ],
    actions: {
      ask: 'Write the outcome as one checkable sentence, then name the single next physical action — something you could do in the next hour.',
      analyze: 'Split what you know from what you assume, then test the assumption that would sink this if it turned out false.',
      plan: 'Cut the goal into three blocks — this week, next week, later — and do the first 20 minutes of this week’s block today.',
      create: 'Make the ugliest first version in 20 minutes — a page, a list, a slide. You can’t edit something that doesn’t exist.',
    },
    why: [
      'Vague goals produce vague effort. A checkable definition of done converts anxiety into a task you can actually finish.',
      'Small finished things move projects; large planned things don’t. The first physical action is the only part you fully control.',
    ],
    followUps: [
      'Turn this into a 7-day plan',
      'What’s the first physical action?',
    ],
  },
]

// ---------------------------------------------------------------- helpers

function hashOf(str) {
  let h = 0
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Unambiguous, topic-defining terms — worth double weight so generic words
// ("views", "post", "traffic") can't hijack the classification on a tie.
const STRONG = {
  social: ['instagram', 'tiktok', 'reels', 'followers', 'reach', 'algorithm', 'saves'],
  marketing: ['ctr', 'conversion', 'funnel', 'landing page', 'open rate', 'roi', 'cpa'],
  content: ['newsletter', 'script', 'brainstorm', 'draft', 'hook'],
  academic: ['essay', 'thesis', 'professor', 'supervisor', 'dissertation', 'rubric', 'exam'],
  career: ['resume', 'cv', 'interview', 'recruiter', 'internship', 'hiring', 'referral'],
  plan: ['overwhelmed', 'procrastinate', 'burnout', 'prioritize', 'prioritise'],
  launch: ['mvp', 'pricing', 'saas', 'onboarding', 'retention', 'beta'],
  data: ['kpi', 'dashboard', 'baseline', 'metric', 'segment'],
  general: [],
}

// Which topics suit which intent — used only to break exact ties.
const MODE_TIE_BREAK = {
  analyze: ['data', 'marketing', 'social'],
  plan: ['plan', 'academic'],
  create: ['content', 'launch'],
  ask: [],
}

function scoreTopic(text, topic) {
  if (!topic.keywords.length) return 0
  const strong = STRONG[topic.id] || []
  let score = 0
  for (const kw of topic.keywords) {
    const re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(kw)}([^a-z0-9]|$)`, 'i')
    if (re.test(text)) {
      const weight = kw.includes(' ') || strong.includes(kw) ? 2 : 1
      score += weight
    }
  }
  return score
}

export function classifyTopic(rawInput, mode) {
  const text = String(rawInput || '').toLowerCase().slice(0, 600)
  const tieTopics = MODE_TIE_BREAK[mode] || []
  let best = TOPICS[TOPICS.length - 1]
  let bestScore = -1
  for (const topic of TOPICS) {
    let s = scoreTopic(text, topic)
    if (s > 0 && tieTopics.includes(topic.id)) s += 0.5
    if (s > bestScore) {
      best = topic
      bestScore = s
    }
  }
  return best
}

const PLAN_RE = /\b(plan|planning|schedule|roadmap|sequence|outline|calendar|next 7|this week|timeline|steps to)\b/i
const CREATE_RE = /\b(write|draft|create|script|brainstorm|design|build a|post about|idea for|hooks|outline a)\b/i
const ANALYZE_RE = /\b(analy[sz]e|why|what happened|diagnos|investigat|compare|dropped|decline|fell|understand the data|which one)\b/i

export function inferMode(rawInput) {
  const text = String(rawInput || '')
  if (CREATE_RE.test(text)) return 'create'
  if (PLAN_RE.test(text)) return 'plan'
  if (ANALYZE_RE.test(text)) return 'analyze'
  return 'ask'
}

// ---------------------------------------------------------------- validation

const SIGNAL_RE = /[a-z]{3,}/i

export function validateInput(raw) {
  const value = String(raw == null ? '' : raw)
  const trimmed = value.trim()
  if (!trimmed) {
    return {
      ok: false,
      message: 'Tell NEO what you’re working on — a question, idea, problem, or goal.',
    }
  }
  if (!SIGNAL_RE.test(trimmed)) {
    return {
      ok: false,
      message:
        'That’s mostly symbols or numbers. Add a sentence about the situation — for example: “My Instagram reach dropped this month. What should I investigate?”',
    }
  }
  return { ok: true, value: trimmed }
}

export function starterForMode(mode, projectId, projectStarters) {
  if (projectId && projectStarters && projectStarters[mode]) return projectStarters[mode]
  return DEFAULT_STARTERS[mode] || DEFAULT_STARTERS.ask
}

// ---------------------------------------------------------------- engine

const MAX_ANALYSIS_CHARS = 900

export function generateResponse({ input, mode, projectId, projectName }) {
  try {
    const full = String(input == null ? '' : input)
    const trimmed = full.trim()
    const analyzed = trimmed.slice(0, MAX_ANALYSIS_CHARS)
    const truncated = trimmed.length > MAX_ANALYSIS_CHARS

    const usedMode = MODES[mode] ? mode : 'analyze'
    const topic = classifyTopic(analyzed, usedMode)
    const h = hashOf(analyzed + usedMode)

    const seeing = topic.seeing[h % topic.seeing.length]
    const checks = [0, 1, 2, 3].map((i) => topic.checks[(h + i) % topic.checks.length])
    const uniqueChecks = [...new Set(checks)]
    while (uniqueChecks.length < 3) {
      const candidate = topic.checks[uniqueChecks.length % topic.checks.length]
      if (!uniqueChecks.includes(candidate)) uniqueChecks.push(candidate)
      else break
    }
    const action = topic.actions[usedMode] || topic.actions.ask
    const why = topic.why[h % topic.why.length]
    const closer = MODES[usedMode].closer
    const followUps = topic.followUps

    return {
      id: `${Date.now()}-${h}`,
      mode: usedMode,
      topicId: topic.id,
      topicLabel: topic.label,
      snippet: trimmed.length > 120 ? `${trimmed.slice(0, 117)}…` : trimmed,
      truncated,
      projectId: projectId || null,
      projectName: projectName || null,
      timebox: MODES[usedMode].timebox,
      sections: [
        { key: 'seeing', title: 'What I’m seeing', body: seeing },
        { key: 'checks', title: 'What to check', list: uniqueChecks.slice(0, 3) },
        { key: 'action', title: 'Next action', body: action },
        {
          key: 'why',
          title: 'Why',
          body: closer ? `${why} ${closer}` : why,
        },
      ],
      followUps,
    }
  } catch (err) {
    // Never surface raw errors — fall back to the safest useful answer.
    const fallback = TOPICS[TOPICS.length - 1]
    return {
      id: `${Date.now()}-fallback`,
      mode: MODES[mode] ? mode : 'ask',
      topicId: fallback.id,
      topicLabel: fallback.label,
      snippet: String(input || '').slice(0, 120),
      truncated: false,
      projectId: projectId || null,
      projectName: projectName || null,
      timebox: MODES.ask.timebox,
      sections: [
        { key: 'seeing', title: 'What I’m seeing', body: fallback.seeing[0] },
        { key: 'checks', title: 'What to check', list: fallback.checks.slice(0, 3) },
        { key: 'action', title: 'Next action', body: fallback.actions.ask },
        { key: 'why', title: 'Why', body: fallback.why[0] },
      ],
      followUps: fallback.followUps,
    }
  }
}
