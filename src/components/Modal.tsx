import type { ReactNode } from 'react'

interface Props {
  onClose: () => void
  maxWidth?: number
  children: ReactNode
}

export default function Modal({ onClose, maxWidth = 600, children }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 rounded-2xl p-6 w-full overflow-y-auto"
        style={{ maxWidth: `${maxWidth}px`, maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold z-10"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
