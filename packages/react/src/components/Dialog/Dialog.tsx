'use client'

import {
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { RemoveScroll } from 'react-remove-scroll'
import { isMobile } from '../../utils.js'
import * as styles from './Dialog.css.js'
import { FocusTrap } from './FocusTrap.js'

const stopPropagation: MouseEventHandler<unknown> = (event) =>
  event.stopPropagation()

interface DialogProps {
  open: boolean
  onClose: () => void
  titleId: string
  onMountAutoFocus?: (event: Event) => void
  children: ReactNode
}

export function Dialog({ children, onClose, open, titleId }: DialogProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) =>
      open && event.key === 'Escape' && onClose()

    document.addEventListener('keydown', handleEscape)

    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  const [bodyScrollable, setBodyScrollable] = useState(true)
  useEffect(() => {
    setBodyScrollable(
      getComputedStyle(window.document.body).overflow !== 'hidden',
    )
  }, [])

  const handleBackdropClick = useCallback(() => onClose(), [onClose])

  return (
    <>
      {open
        ? createPortal(
            <RemoveScroll enabled={bodyScrollable}>
              <div
                style={{
                  alignItems: isMobile() ? 'flex-end' : 'center',
                  position: 'fixed',
                }}
                aria-labelledby={titleId}
                aria-modal
                className={styles.overlay}
                onClick={handleBackdropClick}
                role="dialog"
              >
                <FocusTrap
                  className={styles.content}
                  onClick={stopPropagation}
                  role="document"
                >
                  {children}
                </FocusTrap>
              </div>
            </RemoveScroll>,
            document.body,
          )
        : null}
    </>
  )
}
