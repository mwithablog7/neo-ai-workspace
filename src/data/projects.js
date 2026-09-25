// Demo projects — realistic sample content for the NEO prototype.
// No lorem ipsum, no fake personas: believable work a real user might track.

export const PROJECTS = [
  {
    id: 'marketing-portfolio',
    name: 'Marketing Portfolio',
    goal: 'Build a portfolio demonstrating marketing strategy and analytics.',
    context:
      'Six campaign case studies being turned into one narrative for entry-level marketing roles. Two are drafted, the analytics screenshots still need exporting, and the structure changes every time a new case lands.',
    status: 'Active · 2 of 6 cases drafted',
    activity: [
      'Rewrote the opening of the “Silk Whisk launch” case study',
      'Pulled 30-day reach numbers for the Instagram audit',
      'Added a Results section to case study #2',
    ],
    tasks: [
      'Export analytics screenshots for cases 3–6',
      'Lock one case study template and reuse it',
      'Publish the portfolio landing page',
    ],
    starters: {
      ask: 'What’s the fastest useful next step for my Marketing Portfolio right now?',
      analyze:
        'Analyze which Marketing Portfolio case study is closest to publishable and what’s blocking it.',
      plan: 'Plan the next 7 days for my Marketing Portfolio: three outcomes, blocked time, and one thing to cut.',
      create:
        'Create a first draft for my Marketing Portfolio: one idea, the hook, and the first three steps.',
    },
  },
  {
    id: 'the-silk-whisk',
    name: 'The Silk Whisk',
    goal: 'Grow an AI-powered cozy cooking content brand.',
    context:
      'A slow-cooking recipe brand with AI-assisted scripts and human testing. Publishing three times a week across two channels; reach slipped over the last month while saves stayed strong.',
    status: 'Active · posting 3× per week',
    activity: [
      'Tested 4 hook variants on the pumpkin broth reel',
      'Scheduled Tuesday’s recipe carousel',
      'Drafted the 30-day content calendar',
    ],
    tasks: [
      'Re-test the best hook in a new format',
      'Batch-film two slow-cooker recipes',
      'Reply to the 12 unanswered DMs',
    ],
    starters: {
      ask: 'What’s the fastest useful next step for The Silk Whisk right now?',
      analyze:
        'Analyze why The Silk Whisk reach dropped this month while saves stayed steady.',
      plan: 'Plan the next 7 days for The Silk Whisk: three outcomes, blocked time, and one thing to cut.',
      create:
        'Create a first draft for The Silk Whisk: one recipe idea, the hook, and the first three steps.',
    },
  },
  {
    id: 'university-final-project',
    name: 'University Final Project',
    goal: 'Develop and present a strong final academic project.',
    context:
      'A media-effects study on short-form video and attention, due in five weeks. The literature review is solid; the survey pilot still has 14 gaps and the presentation outline doesn’t exist yet.',
    status: 'Active · due in 5 weeks',
    activity: [
      'Sorted 38 sources into four themes',
      'Ran the pilot survey with 22 participants',
      'Booked a supervisor slot for Thursday',
    ],
    tasks: [
      'Draft the methods section (90-minute block)',
      'Fix pilot survey question 6',
      'Outline the 12-slide presentation',
    ],
    starters: {
      ask: 'What’s the fastest useful next step for my final project right now?',
      analyze:
        'Analyze what’s weakest in my final project right now — methods, data, or presentation.',
      plan: 'Plan the next 7 days for my final project: three outcomes, blocked time, and one thing to cut.',
      create:
        'Create a first draft for my final project presentation: the story, the slides, and the first three steps.',
    },
  },
]

export function getProject(id) {
  return PROJECTS.find((p) => p.id === id) || null
}
