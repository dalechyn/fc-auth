import type { ButtonHTMLAttributes } from 'react'
import {
  primaryButton,
  resetButton,
  secondaryButton,
  tertiaryButton,
} from './styles.css.js'

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: 'primary' | 'secondary' | 'tertiary' | 'reset'
}

export function Button({
  kind = 'primary',
  children,
  className,
  ...rest
}: Props) {
  return (
    <button type="button" className={kindClass[kind] || className} {...rest}>
      {children}
    </button>
  )
}

const kindClass = {
  primary: primaryButton,
  secondary: secondaryButton,
  tertiary: tertiaryButton,
  reset: resetButton,
}
