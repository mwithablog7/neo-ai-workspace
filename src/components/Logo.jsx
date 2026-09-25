// NEO wordmark — a geometric N whose right stroke rises into an arrow.
// Rendered inline so it inherits color and never depends on an external asset.
export default function Logo({ tagline = false, size = 'md' }) {
  return (
    <span className={`logo logo--${size}`}>
      <svg className="logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <g
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 27 V7" stroke="currentColor" />
          <path d="M7 7 L21 27" stroke="currentColor" />
          <path d="M21 27 V6" className="logo__accent" />
          <path d="M16 11 L21 5.5 L26 11" className="logo__accent" />
        </g>
      </svg>
      <span className="logo__text">
        <span className="logo__word">NEO</span>
        {tagline ? (
          <span className="logo__tagline">Think clearly. Move forward.</span>
        ) : null}
      </span>
    </span>
  )
}
