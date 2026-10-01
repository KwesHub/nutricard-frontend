import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface Props {
  onClose: () => void
  maxWidth?: number
  label?: string
  flush?: boolean
  children: ReactNode
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({ onClose, maxWidth = 600, label = 'Details', flush = false, children }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  // Kept in a ref so the effect below runs once; an inline onClose changes on every parent render.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const opener = document.activeElement as HTMLElement | null
    dialog.focus()

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !dialog) return
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === dialog)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      opener?.focus()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`relative bg-gray-900 rounded-2xl w-full overflow-y-auto focus:outline-none ${flush ? '' : 'p-6'}`}
        style={{ maxWidth: `${maxWidth}px`, maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-fg w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold z-10"
        >
          <span aria-hidden="true">✕</span>
        </button>
        {children}
      </div>
    </div>
  )
}
