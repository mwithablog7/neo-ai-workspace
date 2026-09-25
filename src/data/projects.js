// Demo projects — generic sample content for the NEO prototype.
// No personal brands, real clients, or identifying information:
// just believable work a real user might track.

export const PROJECTS = [
  {
    id: 'marketing-campaign',
    name: 'Marketing Campaign',
    goal: 'Plan and improve a digital marketing campaign.',
    context:
      'A four-week product launch campaign across email and social. The calendar exists but the first week underperformed, so the plan is being reworked around what actually reached people.',
    status: 'Active · week 2 of 4',
    activity: [
      'Drafted three hook variants for the launch carousel',
      'Pulled the 4-week reach summary',
      'Reordered the week-2 calendar around email',
    ],
    tasks: [
      'Compare the two launch hooks and pick one to reuse',
      'Rewrite the week-3 posts around the winning format',
      'Block 60 minutes to schedule everything at once',
    ],
    starters: {
      ask: 'What’s the fastest useful next step for my marketing campaign right now?',
      analyze:
        'Analyze why my campaign reach dipped in week 1 while engagement stayed steady.',
      plan: 'Plan the next 7 days of my marketing campaign: three outcomes, blocked time, and one thing to cut.',
      create:
        'Create a first draft for my campaign: one launch idea, the hook, and the first three steps.',
    },
  },
  {
    id: 'content-strategy',
    name: 'Content Strategy',
    goal: 'Build a consistent content strategy and understand what performs.',
    context:
      'Posting three times a week across two formats with no real system behind it. Volume is steady, but it is unclear which formats build an audience and which ones just fill a calendar.',
    status: 'Active · posting 3× per week',
    activity: [
      'Tagged the last 12 posts by format and topic',
      'Outlined next week’s posting calendar',
      'Noted that carousels out-reached short videos',
    ],
    tasks: [
      'Rank the last 10 posts by saves, not likes',
      'Choose one pillar topic and write 5 post ideas for it',
      'Set a repeating 30-minute weekly planning slot',
    ],
    starters: {
      ask: 'What’s the fastest useful next step for my content strategy right now?',
      analyze:
        'Analyze which of my content formats performs best and what I should do more of.',
      plan: 'Plan the next 7 days of my content strategy: three outcomes, blocked time, and one thing to cut.',
      create:
        'Create a first draft for my content strategy: one series idea, the hook, and the first three steps.',
    },
  },
  {
    id: 'university-project',
    name: 'University Project',
    goal: 'Organize research, ideas, tasks, and deliverables for an academic project.',
    context:
      'A research project due in five weeks. The literature base is solid, but sources live in three places, the outline keeps changing, and the presentation does not exist yet.',
    status: 'Active · due in 5 weeks',
    activity: [
      'Sorted 38 sources into four themes',
      'Ran the pilot survey with 22 participants',
      'Booked a supervisor slot for Thursday',
    ],
    tasks: [
      'Draft the methods section in a 90-minute block',
      'Merge the three source lists into one document',
      'Outline the 12-slide presentation',
    ],
    starters: {
      ask: 'What’s the fastest useful next step for my university project right now?',
      analyze:
        'Analyze what’s weakest in my university project right now — methods, sources, or presentation.',
      plan: 'Plan the next 7 days for my university project: three outcomes, blocked time, and one thing to cut.',
      create:
        'Create a first draft for my university project presentation: the story, the slides, and the first three steps.',
    },
  },
]

// Dashboard "Recent activity" — sample feed across the demo projects.
export const RECENT_ACTIVITY = [
  { id: 'a1', projectId: 'marketing-campaign', text: 'Drafted three hook variants for the launch carousel', time: '2h ago' },
  { id: 'a2', projectId: 'content-strategy', text: 'Tagged the last 12 posts by format and topic', time: '5h ago' },
  { id: 'a3', projectId: 'university-project', text: 'Sorted 38 sources into four themes', time: 'Yesterday' },
  { id: 'a4', projectId: 'marketing-campaign', text: 'Pulled the 4-week reach summary', time: 'Yesterday' },
  { id: 'a5', projectId: 'content-strategy', text: 'Outlined next week’s posting calendar', time: '2 days ago' },
  { id: 'a6', projectId: 'university-project', text: 'Booked a supervisor slot for Thursday', time: '2 days ago' },
]

export function getProject(id) {
  return PROJECTS.find((p) => p.id === id) || null
}
