import { useState, useEffect } from 'react'
import { Plus, Trash2, Clock } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'

export default function MatchNotesWidget() {
  const session = useGameSession()
  const [notes, setNotes] = useState([])
  const [draft, setDraft] = useState('')

  useEffect(() => { setNotes([]) }, [session?.game?.id])

  function addNote() {
    if (!draft.trim()) return
    setNotes(n => [{ id: crypto.randomUUID(), text: draft.trim(), time: new Date() }, ...n])
    setDraft('')
  }

  function removeNote(id) {
    setNotes(n => n.filter(x => x.id !== id))
  }

  function formatTime(d) {
    return d.toLocaleTimeString('gl', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-4">
      {session?.game && (
        <p className="text-xogun-muted text-xs -mt-1">Notas de: {session.game.name}</p>
      )}

      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Escribe unha nota rápida..." value={draft}
          onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} />
        <button onClick={addNote} disabled={!draft.trim()} className="btn-secondary px-3 disabled:opacity-30">
          <Plus size={14} />
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-xogun-muted text-sm text-center py-8">
          Sen notas aínda. Apunta pistas, recordatorios ou calquera cousa que non queiras esquecer durante a partida.
        </p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {notes.map(note => (
            <div key={note.id} className="card flex items-start gap-2 py-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-xogun-text break-words">{note.text}</p>
                <p className="text-xogun-muted text-[10px] flex items-center gap-1 mt-1">
                  <Clock size={9} /> {formatTime(note.time)}
                </p>
              </div>
              <button onClick={() => removeNote(note.id)} className="text-xogun-muted hover:text-xogun-red flex-shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
