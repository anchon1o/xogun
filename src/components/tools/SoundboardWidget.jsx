import { useState } from 'react'
import { SOUND_EFFECTS, playSoundEffect } from '../../lib/soundEffects'

export default function SoundboardWidget() {
  const [pressed, setPressed] = useState(null)

  function trigger(id) {
    playSoundEffect(id)
    setPressed(id)
    setTimeout(() => setPressed(null), 200)
  }

  return (
    <div className="space-y-4">
      <p className="text-xogun-muted text-xs text-center">
        Efectos de sonido curtos — soan á vez que a música, sen interromperse mutuamente.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {SOUND_EFFECTS.map(fx => (
          <button key={fx.id} onClick={() => trigger(fx.id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${pressed === fx.id ? 'border-xogun-accent bg-xogun-accent/20 scale-95' : 'border-xogun-border bg-xogun-surface hover:border-xogun-accent/50'}`}>
            <span className="text-2xl">{fx.emoji}</span>
            <span className="text-xogun-muted text-[10px] text-center">{fx.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
