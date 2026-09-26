import { motion } from 'motion/react';

/**
 * Lee Gym — Button component
 *
 * Variants:
 *   primary   — Yellow fill, charcoal text  (main CTA)
 *   secondary — Transparent, charcoal border + text
 *   ghost     — No border, text only
 *
 * Sizes: sm | md | lg
 *
 * Pass `as="a"` or `href` to render as an anchor tag.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  className = '',
  ...props
}) {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-semibold tracking-wide',
    'rounded-sm cursor-pointer select-none whitespace-nowrap',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2',
  ].join(' ');

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-9 py-4 text-base',
  };

  const variants = {
    primary: [
      'text-charcoal',
    ].join(' '),
    secondary: [
      'text-charcoal border-2 border-charcoal',
    ].join(' '),
    ghost: [
      'text-charcoal bg-transparent',
    ].join(' '),
  };

  const primaryStyle = variant === 'primary'
    ? { backgroundColor: 'var(--color-yellow)', color: 'var(--color-charcoal)', fontFamily: 'var(--font-body)' }
    : variant === 'secondary'
    ? { backgroundColor: 'transparent', color: 'var(--color-charcoal)', borderColor: 'var(--color-charcoal)', fontFamily: 'var(--font-body)' }
    : { backgroundColor: 'transparent', color: 'var(--color-charcoal)', fontFamily: 'var(--font-body)' };

  const MotionTag = motion[Tag] || motion.button;
  const classes = [base, sizes[size], variants[variant], className].join(' ');

  return (
    <MotionTag
      className={classes}
      style={primaryStyle}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export default Button;
