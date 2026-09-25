// DEMO analytics — clearly labelled sample data, never presented as live.
// Numbers are internally consistent so the insight actually follows from the chart.

export const WEEKS = [
  { label: 'Jul 20', full: 'Week of Jul 20', reach: 11800, engagement: 4.2, followers: 4820, posts: 5 },
  { label: 'Jul 27', full: 'Week of Jul 27', reach: 12600, engagement: 4.4, followers: 4890, posts: 6 },
  { label: 'Aug 3', full: 'Week of Aug 3', reach: 13400, engagement: 4.1, followers: 4960, posts: 5 },
  { label: 'Aug 10', full: 'Week of Aug 10', reach: 12900, engagement: 4.3, followers: 5030, posts: 6 },
  { label: 'Aug 17', full: 'Week of Aug 17', reach: 10200, engagement: 4.3, followers: 5090, posts: 3 },
  { label: 'Aug 24', full: 'Week of Aug 24', reach: 9400, engagement: 4.5, followers: 5150, posts: 4 },
  { label: 'Aug 31', full: 'Week of Aug 31', reach: 8700, engagement: 4.4, followers: 5195, posts: 3 },
  { label: 'Sep 7', full: 'Week of Sep 7', reach: 9100, engagement: 4.6, followers: 5240, posts: 3 },
]

export const STATS = [
  {
    id: 'reach',
    label: 'Reach',
    value: '37.4K',
    sub: 'impressions · last 4 weeks',
    delta: '−26% vs previous 4 weeks',
    trend: 'down',
    note: 'Distribution is shrinking.',
  },
  {
    id: 'engagement',
    label: 'Engagement rate',
    value: '4.5%',
    sub: 'average · last 4 weeks',
    delta: '+0.2 pp vs previous 4 weeks',
    trend: 'flat',
    note: 'Holding steady, slightly up.',
  },
  {
    id: 'followers',
    label: 'Followers',
    value: '5,240',
    sub: 'total · sample account',
    delta: '+420 (+8.7%) in 8 weeks',
    trend: 'up',
    note: 'Still growing, just slower.',
  },
  {
    id: 'published',
    label: 'Content published',
    value: '13',
    sub: 'posts · last 4 weeks',
    delta: '−9 vs previous 4 weeks',
    trend: 'down',
    note: 'Volume fell alongside reach.',
    mini: WEEKS.map((w) => w.posts),
  },
]

export const INSIGHT = {
  title: 'Reach fell while engagement held — check distribution, not the content',
  body:
    'Reach is down 26% over the last four weeks, but engagement rate held and even edged up (4.2% → 4.6%), while posting volume fell from about 5.5 to 3.3 posts per week. When reach moves and engagement doesn’t, the usual culprit is distribution and cadence — format mix, timing, and how often you show up — not content quality. The people who saw the work still engaged with it.',
  ask:
    'Analyze my demo analytics: reach fell 26% while engagement stayed flat. What should I investigate first?',
}

export function formatCompact(n) {
  if (n >= 1000) {
    const k = n / 1000
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`
  }
  return String(n)
}
