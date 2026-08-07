import { useState, useEffect } from 'react'
import { Plus, Trash2, Clock } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'

const STORAGE_KEY = (gameId) => `xogun-notes-${gameId ?? 'no-game'}`

function loadNotes(gameId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(gameId))
    if (!raw) return []
    return JSON.parse(raw).map(n => ({ ...n, time: new Date(n.time) }))
  } catch {
    return []
  }
}

function saveNotes(gameId, notes) {
  try {
    localStorage.setItem(STORAGE_KEY(gameId), JSON.stringify(notes))
  } catch {
    // localStorage non dispoñible — non é crítico
  }
}

export default function MatchNotesWidget() {
  const session = useGameSession()
  const gameId = session?.game?.id ?? null
  const [notes, setNotes] = useState(() => loadNotes(gameId))
  const [draft, setDraft] = useState('')

  // Carga as notas ao cambiar de xogo
  useEffect(() => {
    setNotes(loadNotes(gameId))
  }, [gameId])

  // Persiste cada vez que cambian as notas
  useEffect(() => {
    saveNotes(gameId, notes)
  }, [notes, gameId])

  function addNote() {
    if (!draft.trim()) return
    setNotes(n => [{ id: crypto.randomUUID(), text: draft.trim(), time: new Date() }, ...n])
    setDraft('')
  }

  function removeNote(id) {
    setNotes(n => n.filter(x => x.id !== id))
  }

  function clearAll() {
    if (notes.length === 0) return
    setNotes([])
  }

  function formatTime(d) {
    return d instanceof Date && !isNaN(d)
      ? d.toLocaleTimeString('gl', { hour: '2-digit', minute: '2-digit' })
      : ''
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
        <>
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
          <button onClick={clearAll} className="text-xogun-muted hover:text-xogun-red text-xs transition-colors w-full text-center">
            Borrar todas as notas
          </button>
        </>
      )}
    </div>
  )
}
