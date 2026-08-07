import { useState } from 'react'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminBggSync() {
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [log, setLog] = useState([])

  function addLog(msg, type = 'info') {
    setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString('gl', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }])
  }

  async function runSync() {
    setRunning(true)
    setResults(null)
    setError(null)
    setLog([])

    addLog('Obtendo xogos con BGG ID sen imaxe...')

    // Buscar xogos que teñen bgg_id pero non teñen imaxe_url
    const { data: games, error: fetchError } = await supabase
      .from('games')
      .select('id, name, bgg_id, image_url')
      .not('bgg_id', 'is', null)
      .or('image_url.is.null,image_url.eq.')

    if (fetchError) {
      setError('Non se puideron obter os xogos: ' + fetchError.message)
      setRunning(false)
      return
    }

    if (!games || games.length === 0) {
      addLog('Non hai xogos pendentes de sincronizar. Todos os xogos con BGG ID xa teñen imaxe.', 'success')
      setResults({ total: 0, ok: 0, failed: 0 })
      setRunning(false)
      return
    }

    addLog(`${games.length} xogos sen imaxe atopados. Iniciando sincronización...`)

    let ok = 0
    let failed = 0

    for (const game of games) {
      try {
        addLog(`Procesando: ${game.name} (BGG #${game.bgg_id})`)

        const res = await fetch(`/api/bgg-bulk-sync?bgg_id=${game.bgg_id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()

        if (data.image_url) {
          const { error: updateError } = await supabase
            .from('games')
            .update({ image_url: data.image_url })
            .eq('id', game.id)

          if (updateError) throw new Error(updateError.message)

          addLog(`✓ ${game.name} — imaxe actualizada`, 'success')
          ok++
        } else {
          addLog(`— ${game.name} — BGG non devolveu imaxe`, 'warn')
          failed++
        }
      } catch (e) {
        addLog(`✗ ${game.name} — erro: ${e.message}`, 'error')
        failed++
      }

      // Pequena pausa para non saturar a API de BGG
      await new Promise(r => setTimeout(r, 300))
    }

    setResults({ total: games.length, ok, failed })
    addLog(`Sincronización rematada — ${ok} actualizados, ${failed} fallidos`, ok === games.length ? 'success' : 'warn')
    setRunning(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-lg text-xogun-accent">Sincronización masiva BGG</h2>
        <p className="text-xogun-muted text-sm mt-1">
          Busca automaticamente imaxes en BoardGameGeek para todos os xogos que teñen BGG ID pero non teñen imaxe asignada.
        </p>
      </div>

      {/* Estado de resultados */}
      {results && (
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center">
            <p className="text-xogun-muted text-xs mb-1">Total</p>
            <p className="font-display text-2xl text-xogun-text">{results.total}</p>
          </div>
          <div className="card text-center">
            <p className="text-xogun-muted text-xs mb-1">Actualizados</p>
            <p className="font-display text-2xl text-green-400">{results.ok}</p>
          </div>
          <div className="card text-center">
            <p className="text-xogun-muted text-xs mb-1">Fallidos</p>
            <p className="font-display text-2xl text-xogun-red">{results.failed}</p>
          </div>
        </div>
      )}

      {/* Botón de inicio */}
      <button
        onClick={runSync}
        disabled={running}
        className="btn-primary flex items-center gap-2 disabled:opacity-50"
      >
        {running
          ? <><RefreshCw size={15} className="animate-spin" /> Sincronizando...</>
          : <><Play size={15} /> Iniciar sincronización</>
        }
      </button>

      {error && (
        <div className="card border-xogun-red/40 bg-xogun-red/5 flex items-start gap-2">
          <XCircle size={15} className="text-xogun-red flex-shrink-0 mt-0.5" />
          <p className="text-xogun-red text-sm">{error}</p>
        </div>
      )}

      {/* Log en tempo real */}
      {log.length > 0 && (
        <div className="card space-y-1 max-h-96 overflow-y-auto font-mono text-xs">
          <p className="label mb-2">Rexistro</p>
          {log.map((entry, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xogun-muted flex-shrink-0">{entry.time}</span>
              {entry.type === 'success' && <CheckCircle size={11} className="text-green-400 flex-shrink-0 mt-0.5" />}
              {entry.type === 'error'   && <XCircle size={11} className="text-xogun-red flex-shrink-0 mt-0.5" />}
              {entry.type === 'warn'    && <AlertCircle size={11} className="text-xogun-accent flex-shrink-0 mt-0.5" />}
              {entry.type === 'info'    && <span className="w-[11px] flex-shrink-0" />}
              <span className={
                entry.type === 'success' ? 'text-green-400' :
                entry.type === 'error'   ? 'text-xogun-red' :
                entry.type === 'warn'    ? 'text-xogun-accent' :
                'text-xogun-muted'
              }>{entry.msg}</span>
            </div>
          ))}
        </div>
      )}

      <div className="card bg-xogun-surface border-xogun-border/50">
        <p className="text-xogun-muted text-xs leading-relaxed">
          <strong className="text-xogun-text">Nota:</strong> Esta ferramenta só actúa sobre xogos <em>sen imaxe</em>. Non sobreescribe imaxes existentes.
          Se queres reasignar a imaxe dun xogo concreto, usa o panel <strong>Imaxes</strong>.
          A sincronización pode tardar varios minutos dependendo do número de xogos pendentes.
        </p>
      </div>
    </div>
  )
}
