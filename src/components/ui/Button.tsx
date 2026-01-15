import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils'
import type { NeonColor } from '@/types'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'color'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'chip'
  color?: NeonColor
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Casino Luxe color styles
const colorStyles: Record<NeonColor, Record<string, string>> = {
  gold: {
    solid: cn(
      'bg-gradient-to-b from-gold-light via-gold to-[#b8962f]',
      'text-casino-green-dark font-bold',
      'shadow-chip',
      'hover:shadow-[0_6px_0_#8b7a2c,0_10px_20px_rgba(0,0,0,0.4),0_0_30px_rgba(212,175,55,0.4)]',
      'active:shadow-chip-pressed active:translate-y-[2px]'
    ),
    outline: cn(
      'bg-transparent border-2 border-gold/60',
      'text-gold font-semibold',
      'hover:bg-gold/10 hover:border-gold',
      'hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'
    ),
    ghost: cn(
      'bg-transparent text-gold',
      'hover:bg-gold/10',
      'hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]'
    ),
    chip: cn(
      'chip-button',
      'text-casino-green-dark font-bold tracking-wide'
    ),
  },
  red: {
    solid: cn(
      'bg-gradient-to-b from-poker-red-light via-poker-red to-[#991b1b]',
      'text-white font-bold',
      'shadow-[0_4px_0_#7f1d1d,0_6px_12px_rgba(0,0,0,0.4)]',
      'hover:shadow-[0_6px_0_#7f1d1d,0_10px_20px_rgba(0,0,0,0.4),0_0_30px_rgba(185,28,28,0.4)]',
      'active:shadow-[0_2px_0_#7f1d1d,0_4px_8px_rgba(0,0,0,0.3)] active:translate-y-[2px]'
    ),
    outline: cn(
      'bg-transparent border-2 border-poker-red/60',
      'text-poker-red font-semibold',
      'hover:bg-poker-red/10 hover:border-poker-red',
      'hover:shadow-[0_0_20px_rgba(185,28,28,0.3)]'
    ),
    ghost: cn(
      'bg-transparent text-poker-red',
      'hover:bg-poker-red/10'
    ),
    chip: cn(
      'chip-button-red',
      'text-white font-bold tracking-wide'
    ),
  },
  green: {
    solid: cn(
      'bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700',
      'text-white font-bold',
      'shadow-[0_4px_0_#065f46,0_6px_12px_rgba(0,0,0,0.4)]',
      'hover:shadow-[0_6px_0_#065f46,0_10px_20px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.3)]',
      'active:shadow-[0_2px_0_#065f46,0_4px_8px_rgba(0,0,0,0.3)] active:translate-y-[2px]'
    ),
    outline: cn(
      'bg-transparent border-2 border-emerald-500/60',
      'text-emerald-400 font-semibold',
      'hover:bg-emerald-500/10 hover:border-emerald-400'
    ),
    ghost: cn(
      'bg-transparent text-emerald-400',
      'hover:bg-emerald-500/10'
    ),
    chip: cn(
      'chip-button',
      'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600',
      'text-white font-bold'
    ),
  },
  purple: {
    solid: cn(
      'bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700',
      'text-white font-bold',
      'shadow-[0_4px_0_#581c87,0_6px_12px_rgba(0,0,0,0.4)]',
      'hover:shadow-[0_6px_0_#581c87,0_10px_20px_rgba(0,0,0,0.4),0_0_20px_rgba(168,85,247,0.3)]',
      'active:shadow-[0_2px_0_#581c87,0_4px_8px_rgba(0,0,0,0.3)] active:translate-y-[2px]'
    ),
    outline: cn(
      'bg-transparent border-2 border-purple-500/60',
      'text-purple-400 font-semibold',
      'hover:bg-purple-500/10 hover:border-purple-400'
    ),
    ghost: cn(
      'bg-transparent text-purple-400',
      'hover:bg-purple-500/10'
    ),
    chip: cn(
      'chip-button',
      'bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600',
      'text-white font-bold'
    ),
  },
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-6 py-3.5 text-lg gap-2',
  xl: 'px-8 py-5 text-xl gap-3',
}

const chipSizeStyles = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', color = 'gold', size = 'md', children, disabled, ...props }, ref) => {
    const isChip = variant === 'chip'
    const sizes = isChip ? chipSizeStyles : sizeStyles

    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? undefined : { scale: 1.02, y: -2 }}
        whileTap={disabled ? undefined : { scale: 0.98, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        disabled={disabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-montserrat font-semibold',
          'transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-casino-green-dark',

          // Rounded style based on variant
          isChip ? 'rounded-full' : 'rounded-xl',

          // Color & variant styles
          colorStyles[color][variant],

          // Size styles
          sizes[size],

          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',

          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

// Chip Button - Specialized poker chip style button
export const ChipButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="chip" {...props} />
)

ChipButton.displayName = 'ChipButton'
