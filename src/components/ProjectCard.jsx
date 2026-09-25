import { IconArrow, IconCheck } from './icons'

// One project card. Selecting it updates the workspace context everywhere.
export default function ProjectCard({ project, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`pcard ${selected ? 'pcard--selected' : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect(project.id)}
    >
      <span className="pcard__top">
        <span className="pcard__initials" aria-hidden="true">
          {project.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
        </span>
        {selected ? (
          <span className="pcard__flag">
            <IconCheck className="pcard__flag-icon" />
            Active
          </span>
        ) : (
          <IconArrow className="pcard__arrow" />
        )}
      </span>
      <span className="pcard__name">{project.name}</span>
      <span className="pcard__goal">{project.goal}</span>
      <span className="pcard__status">{project.status}</span>
    </button>
  )
}
