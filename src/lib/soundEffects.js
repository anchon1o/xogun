let audioCtx = null
function getContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone(freq, duration, type = 'sine', startTime = 0, gainValue = 0.15) {
  const ctx = getContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(gainValue, ctx.currentTime + startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime + startTime)
  osc.stop(ctx.currentTime + startTime + duration)
}

function noise(duration, startTime = 0, gainValue = 0.1) {
  const ctx = getContext()
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(gainValue, ctx.currentTime + startTime)
  source.connect(gain)
  gain.connect(ctx.destination)
  source.start(ctx.currentTime + startTime)
}

export const SOUND_EFFECTS = [
  { id: 'ding',      emoji: '🔔', label: 'Campá',     play: () => tone(1200, 0.4, 'sine') },
  { id: 'success',   emoji: '✅', label: 'Acerto',    play: () => { tone(880, 0.15, 'sine', 0); tone(1320, 0.25, 'sine', 0.1) } },
  { id: 'fail',      emoji: '❌', label: 'Fallo',     play: () => { tone(220, 0.3, 'sawtooth', 0, 0.12); tone(160, 0.4, 'sawtooth', 0.1, 0.12) } },
  { id: 'applause',  emoji: '👏', label: 'Aplauso',   play: () => { for (let i = 0; i < 8; i++) noise(0.12, i * 0.05, 0.08) } },
  { id: 'drumroll',  emoji: '🥁', label: 'Redobre',   play: () => { for (let i = 0; i < 12; i++) noise(0.08, i * 0.09, 0.1) } },
  { id: 'fanfare',   emoji: '📯', label: 'Fanfarria', play: () => { tone(523, 0.15, 'square', 0); tone(659, 0.15, 'square', 0.15); tone(784, 0.35, 'square', 0.3) } },
  { id: 'buzzer',    emoji: '🚨', label: 'Bucina',    play: () => tone(150, 0.6, 'sawtooth', 0, 0.15) },
  { id: 'click',     emoji: '👆', label: 'Clic',      play: () => tone(600, 0.05, 'square', 0, 0.1) },
  { id: 'coin',      emoji: '🪙', label: 'Moeda',     play: () => { tone(1400, 0.08, 'sine', 0); tone(1800, 0.15, 'sine', 0.06) } },
  { id: 'whoosh',    emoji: '💨', label: 'Whoosh',    play: () => noise(0.3, 0, 0.15) },
]

export function playSoundEffect(id) {
  const effect = SOUND_EFFECTS.find(e => e.id === id)
  if (effect) { try { effect.play() } catch {} }
}
