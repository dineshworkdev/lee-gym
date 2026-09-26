/**
 * Lee Gym — SectionHeading component
 *
 * Renders a consistent section title with an optional subtitle and
 * a small yellow accent bar underneath the heading.
 */
function SectionHeading({ title, subtitle, align = 'left', className = '' }) {
  const alignClass = {
    left:   'items-start text-left',
    center: 'items-center text-center',
    right:  'items-end text-right',
  }[align];

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      <h2
        className="font-display text-5xl md:text-6xl text-charcoal leading-none tracking-tight"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>

      {/* Yellow accent bar */}
      <div
        className="h-1 w-16 rounded-full"
        style={{ backgroundColor: 'var(--color-yellow)' }}
      />

      {subtitle && (
        <p
          className="text-slate-gym text-base md:text-lg leading-relaxed max-w-xl"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
