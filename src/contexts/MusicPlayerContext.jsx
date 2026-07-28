import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'
import { getYouTubeId } from '../hooks/usePlaylists'

/**
 * Reprodutor de música baseado na YouTube IFrame API, oculto (só audio).
 * Vive neste contexto (montado en App.jsx) para que a música siga soando
 * mentres se navega entre seccións da app — só se detén ao pechar/recargar
 * a pestana do navegador, que é unha limitación do propio navegador.
 */
const MusicPlayerContext = createContext(null)

export function MusicPlayerProvider({ children }) {
  const playerRef = useRef(null)
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [queue, setQueue] = useState([])       // [{ url, title }]
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [volume, setVolumeState] = useState(70)

  // Carga a API de YouTube unha soa vez
  useEffect(() => {
    if (window.YT && window.YT.Player) { initPlayer(); return }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = initPlayer
  }, [])

  function initPlayer() {
    const div = document.createElement('div')
    div.id = 'xogun-yt-player'
    div.style.position = 'fixed'
    div.style.bottom = '-200px'
    div.style.left = '-200px'
    div.style.width = '1px'
    div.style.height = '1px'
    document.body.appendChild(div)

    playerRef.current = new window.YT.Player('xogun-yt-player', {
      height: '1', width: '1',
      playerVars: { autoplay: 0, controls: 0 },
      events: {
        onReady: () => { setReady(true); playerRef.current.setVolume(volume) },
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.ENDED) next()
          setPlaying(e.data === window.YT.PlayerState.PLAYING)
        },
      },
    })
  }

  function loadQueue(tracks, startIndex = 0) {
    setQueue(tracks)
    setCurrentIndex(startIndex)
    playTrack(tracks[startIndex], startIndex)
  }

  function playTrack(track, index) {
    if (!track || !ready) return
    const id = getYouTubeId(track.url)
    if (!id) return
    playerRef.current.loadVideoById(id)
    setCurrentIndex(index)
    setPlaying(true)
  }

  function toggle() {
    if (!ready || currentIndex < 0) return
    if (playing) { playerRef.current.pauseVideo(); setPlaying(false) }
    else { playerRef.current.playVideo(); setPlaying(true) }
  }

  function next() {
    if (queue.length === 0) return
    const nextIndex = (currentIndex + 1) % queue.length
    playTrack(queue[nextIndex], nextIndex)
  }

  function prev() {
    if (queue.length === 0) return
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length
    playTrack(queue[prevIndex], prevIndex)
  }

  function setVolume(v) {
    setVolumeState(v)
    if (ready) playerRef.current.setVolume(v)
  }

  function stop() {
    if (ready) playerRef.current.stopVideo()
    setPlaying(false)
    setCurrentIndex(-1)
    setQueue([])
  }

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null

  return (
    <MusicPlayerContext.Provider value={{
      ready, playing, queue, currentIndex, currentTrack, volume,
      loadQueue, toggle, next, prev, setVolume, stop,
    }}>
      {children}
    </MusicPlayerContext.Provider>
  )
}

export const useMusicPlayer = () => useContext(MusicPlayerContext)
