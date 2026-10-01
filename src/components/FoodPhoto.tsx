import { useState } from 'react'
import { foodIcon } from '../utils/foodIcons'

// Photos live in public/foods/<slug>.jpg; a missing file falls back to the emoji.
function photoUrl(name: string) {
  return `/foods/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`
}

// Decorative: the food's name is always printed next to it, so the image has an empty alt.
export default function FoodPhoto({ name, className = '', emojiClass = 'text-7xl' }: { name: string; className?: string; emojiClass?: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`flex items-center justify-center overflow-hidden bg-black/10 ${className}`}>
      {failed ? (
        <span className={emojiClass} aria-hidden="true">{foodIcon(name)}</span>
      ) : (
        <img
          src={photoUrl(name)}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  )
}
