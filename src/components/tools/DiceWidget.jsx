import { useEffect, useRef, useState } from 'react'

const DIE_SCALE = 0.94
const PHI = (1 + Math.sqrt(5)) / 2
const IPHI = 1 / PHI
const FONTS = [
  { name: 'Oswald', weight: 600, label: 'Oswald' },
  { name: 'Fredoka', weight: 600, label: 'Fredoka' },
  { name: 'Bungee', weight: 400, label: 'Bungee' },
]
const DIE_ORDER = [4, 6, 8, 10, 12, 20, 100, 'coin']
const SOLID_SWATCHES = ['#e8c766', '#c9433a', '#3aa66b', '#3a7fc9', '#9a5fd6', '#e9e4d6']
const GRADIENT_SWATCHES = [
  { c1: '#e8c766', c2: '#8a742f', angle: 135 },
  { c1: '#ff7a59', c2: '#b0362a', angle: 135 },
  { c1: '#48d089', c2: '#1f5c3d', angle: 135 },
  { c1: '#5ab6ff', c2: '#134d86', angle: 135 },
  { c1: '#b98cff', c2: '#5b2ca8', angle: 135 },
]

// Mini editor de debuxo para as caras da moeda (Cara/Cruz)
function CoinFaceEditor({ initialDataUrl, onSave, onClose, label }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [color, setColor] = useState('#c8a96e')
  const [brushSize, setBrushSize] = useState(6)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#181206'
    ctx.beginPath()
    ctx.arc(128, 128, 126, 0, Math.PI * 2)
    ctx.fill()
    if (initialDataUrl) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0)
      img.src = initialDataUrl
    }
  }, [])

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (256 / rect.width),
      y: (clientY - rect.top) * (256 / rect.height),
    }
  }

  function startDraw(e) { drawing.current = true; draw(e) }
  function endDraw() { drawing.current = false }
  function draw(e) {
    if (!drawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(e)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, brushSize, 0, Math.PI * 2)
    ctx.fill()
  }

  function clearCanvas() {
    const ctx = canvasRef.current.getContext('2d')
    ctx.fillStyle = '#181206'
    ctx.beginPath()
    ctx.arc(128, 128, 126, 0, Math.PI * 2)
    ctx.fill()
  }

  function save() {
    onSave(canvasRef.current.toDataURL())
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-xs" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-display text-sm text-xogun-accent">Debuxar — {label}</h3>
          <button onClick={onClose} className="text-xogun-muted text-xl">×</button>
        </div>
        <div className="p-4 space-y-3">
          <canvas ref={canvasRef} width={256} height={256}
            className="rounded-full mx-auto touch-none cursor-crosshair border-2 border-xogun-border"
            style={{ width: 200, height: 200 }}
            onMouseDown={startDraw} onMouseUp={endDraw} onMouseLeave={endDraw} onMouseMove={draw}
            onTouchStart={startDraw} onTouchEnd={endDraw} onTouchMove={draw} />
          <div className="flex items-center justify-center gap-3">
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              className="w-8 h-8 rounded-lg border-2 border-xogun-border cursor-pointer p-0" />
            <input type="range" min={2} max={20} value={brushSize} onChange={e => setBrushSize(+e.target.value)}
              className="flex-1" style={{ accentColor: '#c8a96e' }} />
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={clearCanvas} className="btn-secondary text-xs">Limpar</button>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={save} className="btn-primary">Gardar debuxo</button>
        </div>
      </div>
    </div>
  )
}

export default function DiceWidget() {
  const canvasRef = useRef(null)
  const threeRef = useRef(null)
  const stateRef = useRef({
    dieType: 20, qty: 1, mode: 'gradient',
    color1: '#e8c766', color2: '#8a742f', angle: 135,
    font: 'Oswald', d6pips: false, sound: true,
    history: [], rolling: false,
    coinFaces: { cara: null, cruz: null }, // dataURL personalizadas
  })
  const [ui, setUi] = useState({ ...stateRef.current, result: null, chips: [] })
  const [histOpen, setHistOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [editingFace, setEditingFace] = useState(null) // 'cara' | 'cruz' | null

  const S = stateRef.current
  function sync() { setUi({ ...stateRef.current, result: ui.result, chips: ui.chips }) }

  useEffect(() => {
    let THREE
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.onload = () => { THREE = window.THREE; initThree(THREE) }
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
      if (threeRef.current?.renderer) threeRef.current.renderer.setAnimationLoop(null)
    }
  }, [])

  function initThree(THREE) {
    const canvas = canvasRef.current
    if (!canvas) return
    const V = (x, y, z) => new THREE.Vector3(x, y, z)

    function d10Data() {
      const a = 0.105, h = a * 9.47214, out = []
      for (let i = 0; i < 5; i++) { const b = i * Math.PI * 2 / 5; out.push([Math.cos(b), a, Math.sin(b)]) }
      for (let i = 0; i < 5; i++) { const b = i * Math.PI * 2 / 5 + Math.PI / 5; out.push([Math.cos(b), -a, Math.sin(b)]) }
      out.push([0, -h, 0]); out.push([0, h, 0])
      const faces = []
      for (let i = 0; i < 5; i++) faces.push([11, i, 5 + i, (i + 1) % 5])
      for (let i = 0; i < 5; i++) faces.push([10, 5 + i, (i + 1) % 5, 5 + ((i + 1) % 5)])
      return { vertices: out, faces }
    }

    const POLY = {
      4: { vertices: [[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]], faces: [[1,2,3],[0,3,2],[0,1,3],[0,2,1]] },
      6: { vertices: [[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1]], faces: [[0,1,3,2],[4,5,7,6],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]] },
      8: { vertices: [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]], faces: [[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,4,2],[1,3,4],[1,5,3],[1,2,5]] },
      10: d10Data(),
      12: { vertices: [[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],[0,IPHI,PHI],[0,IPHI,-PHI],[0,-IPHI,PHI],[0,-IPHI,-PHI],[IPHI,PHI,0],[IPHI,-PHI,0],[-IPHI,PHI,0],[-IPHI,-PHI,0],[PHI,0,IPHI],[PHI,0,-IPHI],[-PHI,0,IPHI],[-PHI,0,-IPHI]],
          faces: [[0,8,10,2,16],[0,16,17,1,12],[0,12,14,4,8],[8,4,18,6,10],[2,10,6,15,13],[2,13,3,17,16],[1,17,3,11,9],[1,9,5,14,12],[4,14,5,19,18],[6,18,19,7,15],[3,13,15,7,11],[5,9,11,7,19]] },
      20: { vertices: [[-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],[0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],[PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]],
          faces: [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]] }
    }

    function newellNormal(pts) {
      let nx = 0, ny = 0, nz = 0
      for (let i = 0; i < pts.length; i++) { const c = pts[i], n = pts[(i + 1) % pts.length]; nx += (c.y - n.y) * (c.z + n.z); ny += (c.z - n.z) * (c.x + n.x); nz += (c.x - n.x) * (c.y + n.y) }
      return V(nx, ny, nz).normalize()
    }
    function ptSegDist(p, a, b) {
      const ab = new THREE.Vector3().subVectors(b, a)
      const t = Math.max(0, Math.min(1, new THREE.Vector3().subVectors(p, a).dot(ab) / ab.lengthSq()))
      return new THREE.Vector3().copy(a).addScaledVector(ab, t).distanceTo(p)
    }
    function buildPoly(def) {
      let verts = def.vertices.map(v => V(v[0], v[1], v[2]))
      let R = 0; verts.forEach(v => R = Math.max(R, v.length()))
      const k = DIE_SCALE / R; verts = verts.map(v => v.clone().multiplyScalar(k))
      const faces = [], triPos = [], edgeKeys = new Set(), edgePos = []
      def.faces.forEach(idx => {
        let order = idx.slice(), pts = order.map(i => verts[i])
        const centroid = new THREE.Vector3(); pts.forEach(p => centroid.add(p)); centroid.multiplyScalar(1 / pts.length)
        let normal = newellNormal(pts); if (normal.dot(centroid) < 0) { order.reverse(); pts = order.map(i => verts[i]); normal.negate() }
        let inr = Infinity
        for (let e = 0; e < order.length; e++) inr = Math.min(inr, ptSegDist(centroid, verts[order[e]], verts[order[(e + 1) % order.length]]))
        for (let t = 1; t < order.length - 1; t++) [verts[order[0]], verts[order[t]], verts[order[t + 1]]].forEach(p => triPos.push(p.x, p.y, p.z))
        for (let e = 0; e < order.length; e++) {
          const i1 = order[e], i2 = order[(e + 1) % order.length], kk = Math.min(i1, i2) + '-' + Math.max(i1, i2)
          if (!edgeKeys.has(kk)) { edgeKeys.add(kk); const p1 = verts[i1], p2 = verts[i2]; edgePos.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z) }
        }
        faces.push({ centroid, normal, inradius: inr, cornerIdx: order })
      })
      return { verts, faces, triPos, edgePos }
    }

    function hexRgb(h) { const c = h.replace('#', ''); return { r: parseInt(c.substr(0, 2), 16), g: parseInt(c.substr(2, 2), 16), b: parseInt(c.substr(4, 2), 16) } }
    function lum(h) { const o = hexRgb(h); return (0.2126 * o.r + 0.7152 * o.g + 0.0722 * o.b) / 255 }
    function palette() {
      const s = stateRef.current
      const c1 = new THREE.Color(s.color1), c2 = s.mode === 'gradient' ? new THREE.Color(s.color2) : c1.clone()
      const avg = s.mode === 'gradient' ? (lum(s.color1) + lum(s.color2)) / 2 : lum(s.color1)
      const a = s.angle * Math.PI / 180, dir = V(Math.cos(a), Math.sin(a), 0).normalize()
      const contrast = avg > 0.55 ? '#181206' : '#f8f3e7'
      const edge = new THREE.Color(s.color1)
      if (avg > 0.5) edge.multiplyScalar(0.5); else edge.lerp(new THREE.Color('#ffffff'), 0.4)
      return { c1, c2, dir, avg, contrast, edge }
    }

    function labelTexture(text, contrast, fontName) {
      const f = FONTS.find(x => x.name === fontName) || FONTS[0]
      const c = document.createElement('canvas'); c.width = c.height = 128
      const ctx = c.getContext('2d'); ctx.clearRect(0, 0, 128, 128)
      ctx.fillStyle = contrast; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      let fs = text.length <= 1 ? 86 : text.length === 2 ? 60 : 42
      ctx.font = f.weight + ' ' + fs + 'px "' + f.name + '", sans-serif'
      let w = ctx.measureText(text).width
      if (w > 106) { fs = Math.floor(fs * 106 / w); ctx.font = f.weight + ' ' + fs + 'px "' + f.name + '", sans-serif' }
      ctx.fillText(text, 64, 66)
      if (text.length === 1 && (text === '6' || text === '9')) {
        const uw = fs * 0.52, hh = Math.max(4, fs * 0.09), y = 66 + fs * 0.44
        ctx.fillRect(64 - uw / 2, y, uw, hh)
      }
      const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4; return tex
    }
    function imageTexture(dataUrl, onReady) {
      const tex = new THREE.Texture()
      const img = new Image()
      img.onload = () => { tex.image = img; tex.needsUpdate = true; onReady && onReady() }
      img.src = dataUrl
      return tex
    }
    function pipTexture(value, contrast) {
      const c = document.createElement('canvas'); c.width = c.height = 128
      const ctx = c.getContext('2d'); ctx.clearRect(0, 0, 128, 128); ctx.fillStyle = contrast
      const L = 34, M = 64, H = 94, r = 12.5
      const dot = (x, y) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill() }
      const lay = { 1: [[M,M]], 2: [[L,L],[H,H]], 3: [[L,L],[M,M],[H,H]], 4: [[L,L],[H,L],[L,H],[H,H]], 5: [[L,L],[H,L],[M,M],[L,H],[H,H]], 6: [[L,L],[L,M],[L,H],[H,L],[H,M],[H,H]] }
      ;(lay[value] || []).forEach(p => dot(p[0], p[1]))
      const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t
    }
    function glowTexture() {
      const c = document.createElement('canvas'); c.width = c.height = 128
      const ctx = c.getContext('2d')
      const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
      g.addColorStop(0, 'rgba(255,255,255,0.85)'); g.addColorStop(0.42, 'rgba(255,255,255,0.30)'); g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c)
    }

    function applyColors(g, pal) {
      const p = g.attributes.position.array, n = p.length / 3, col = new Float32Array(n * 3), tmp = new THREE.Color(), R = DIE_SCALE
      for (let i = 0; i < n; i++) {
        let t = (p[i*3] * pal.dir.x + p[i*3+1] * pal.dir.y + p[i*3+2] * pal.dir.z) / (2 * R) + 0.5
        t = Math.max(0, Math.min(1, t)); tmp.copy(pal.c1).lerp(pal.c2, t)
        col[i*3] = tmp.r; col[i*3+1] = tmp.g; col[i*3+2] = tmp.b
      }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.attributes.color.needsUpdate = true
    }

    const glowTex = glowTexture()
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const key = new THREE.DirectionalLight(0xfff4e0, 1.15); key.position.set(3, 10, 5); key.castShadow = true
    key.shadow.mapSize.set(1024, 1024); key.shadow.camera.near = 1; key.shadow.camera.far = 45
    key.shadow.camera.left = -9; key.shadow.camera.right = 9; key.shadow.camera.top = 9; key.shadow.camera.bottom = -9; key.shadow.bias = -0.0004
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x9fb4d8, 0.32); fill.position.set(-5, 4, -3); scene.add(fill)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.34 }))
    floor.rotation.x = -Math.PI / 2; floor.position.y = -DIE_SCALE - 0.02; floor.receiveShadow = true; scene.add(floor)
    const diceGroup = new THREE.Group(); scene.add(diceGroup)
    const glowColor = new THREE.Color('#e8c766')

    let dice = [], anim = [], animating = false, idle = true

    function resize() {
      const w = canvas.clientWidth || 400, h = canvas.clientHeight || 280
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); fitCamera()
    }
    function fitCamera() {
      let ext = 1.2; dice.forEach(d => ext = Math.max(ext, Math.hypot(d.group.position.x, d.group.position.z) + DIE_SCALE))
      const boundR = ext + 0.6, vFov = camera.fov * Math.PI / 180, hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
      const dist = boundR / Math.tan(Math.min(vFov, hFov) / 2) * 1.05
      camera.position.copy(V(0, 1.0, 0.52).normalize().multiplyScalar(dist)); camera.lookAt(0, -0.05, 0)
    }

    function antipodal(faces) {
      const n = faces.length, partner = new Array(n).fill(-1)
      for (let i = 0; i < n; i++) {
        if (partner[i] !== -1) continue; let best = -1, bd = 2
        for (let j = 0; j < n; j++) { if (j === i || partner[j] !== -1) continue; const d = faces[i].normal.dot(faces[j].normal); if (d < bd) { bd = d; best = j } }
        partner[i] = best; if (best !== -1) partner[best] = i
      }
      return partner
    }
    function balancedAssign(faces, entries) {
      const n = faces.length, partner = antipodal(faces), sorted = entries.slice().sort((a, b) => a.contrib - b.contrib)
      const res = new Array(n), done = new Array(n).fill(false); let k = 0
      for (let i = 0; i < n; i++) {
        if (done[i]) continue; const j = partner[i]; res[i] = sorted[k]; done[i] = true
        if (j !== -1 && j !== i && !done[j]) { res[j] = sorted[n - 1 - k]; done[j] = true }
        k++
      }
      for (let i = 0; i < n; i++) if (!res[i]) res[i] = sorted[i]; return res
    }

    function orientPlane(plane, normal) {
      const q = new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), normal); plane.quaternion.copy(q)
      const worldUp = Math.abs(normal.y) > 0.985 ? V(0, 0, -1) : V(0, 1, 0)
      const localUp = V(0, 1, 0).applyQuaternion(q)
      const desired = worldUp.clone().sub(normal.clone().multiplyScalar(worldUp.dot(normal))).normalize()
      const current = localUp.clone().sub(normal.clone().multiplyScalar(localUp.dot(normal))).normalize()
      let ang = Math.acos(Math.max(-1, Math.min(1, current.dot(desired))))
      if (new THREE.Vector3().crossVectors(current, desired).dot(normal) < 0) ang = -ang
      plane.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(normal, ang))
    }

    function buildDice() {
      while (diceGroup.children.length) { const c = diceGroup.children[0]; diceGroup.remove(c) }
      dice = []; const s = stateRef.current, pal = palette()
      const type = s.dieType, qty = type === 100 ? 2 : s.qty

      function makeDie(kind, offset) {
        const group = new THREE.Group(); group.position.set(offset, 0, 0); diceGroup.add(group)
        let pd, faceEntries, landing = 'face'

        if (kind === 'coin') {
          const r = 0.88, h = 0.12, seg = 48
          const geo = new THREE.CylinderGeometry(r, r, h, seg)
          applyColors(geo, pal)
          const mat = new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 80 })
          const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; group.add(mesh)
          const contrast = pal.avg > 0.55 ? '#181206' : '#f8f3e7'
          const custom = stateRef.current.coinFaces || {}

          const caraGeo = new THREE.CircleGeometry(r * 0.92, seg)
          const caraTex = custom.cara ? imageTexture(custom.cara, () => renderer.render(scene, camera)) : labelTexture('Cara', contrast, s.font)
          const caraMesh = new THREE.Mesh(caraGeo, new THREE.MeshBasicMaterial({ map: caraTex, transparent: true }))
          caraMesh.rotation.x = -Math.PI / 2
          caraMesh.position.y = h / 2 + 0.001; group.add(caraMesh)

          const cruzGeo = new THREE.CircleGeometry(r * 0.92, seg)
          const cruzTex = custom.cruz ? imageTexture(custom.cruz, () => renderer.render(scene, camera)) : labelTexture('Cruz', contrast, s.font)
          const cruzMesh = new THREE.Mesh(cruzGeo, new THREE.MeshBasicMaterial({ map: cruzTex, transparent: true }))
          cruzMesh.rotation.x = Math.PI / 2; cruzMesh.position.y = -(h / 2 + 0.001); group.add(cruzMesh)

          const faceMeta = [
            { label: 'Cara', contrib: 1, normal: V(0, 1, 0), centroid: V(0, h / 2, 0), inradius: r * 0.7 },
            { label: 'Cruz', contrib: 0, normal: V(0, -1, 0), centroid: V(0, -h / 2, 0), inradius: r * 0.7 },
          ]
          dice.push({ group, faceMeta, verts: [], kind: 'coin', landing: 'face', glow: null, result: null, winFace: null })
          return
        }

        const sides = kind === 100 ? 10 : kind
        pd = buildPoly(POLY[sides]); landing = kind === 4 ? 'vertex' : 'face'
        const contrast = pal.avg > 0.55 ? '#181206' : '#f8f3e7'

        let labels
        if (kind === 4) { labels = [1,2,3,4].map(n => ({ label: String(n), contrib: n })) }
        else if (kind === 100) {
          labels = ['0','1','2','3','4','5','6','7','8','9'].map((l, i) => ({ label: l, contrib: i }))
        } else {
          labels = Array.from({ length: sides }, (_, i) => ({ label: String(i + 1), contrib: i + 1 }))
        }
        const assigned = balancedAssign(pd.faces, labels)
        const faceMeta = pd.faces.map((f, i) => ({ ...f, label: assigned[i].label, contrib: assigned[i].contrib }))

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pd.triPos.slice(), 3))
        geo.computeVertexNormals(); applyColors(geo, pal)
        const mat = new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 60, specular: new THREE.Color(0x444444) })
        const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; group.add(mesh)

        // Edge lines
        const edgeGeo = new THREE.BufferGeometry()
        edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(pd.edgePos.slice(), 3))
        const edgeMat = new THREE.LineBasicMaterial({ color: pal.edge, linewidth: 1, transparent: true, opacity: 0.6 })
        group.add(new THREE.LineSegments(edgeGeo, edgeMat))

        // Face labels
        faceMeta.forEach(f => {
          const size = f.inradius * (kind === 4 ? 1.1 : 1.5)
          const tex = (kind === 6 && s.d6pips) ? pipTexture(f.contrib, contrast) : labelTexture(f.label, contrast, s.font)
          const plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }))
          plane.position.copy(f.centroid).addScaledVector(f.normal, 0.045)
          orientPlane(plane, f.normal); group.add(plane)
        })

        // Glow
        const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, color: glowColor.clone() }))
        glow.renderOrder = 1.6; glow.visible = false; group.add(glow)

        dice.push({ group, faceMeta, verts: pd.verts, kind: String(sides), landing, glow, result: null, winFace: null })
      }

      if (type === 100) {
        makeDie(10, -0.55); makeDie(10, 0.55)
        // make second die use tens (0,10,20...)
        if (dice[1]) dice[1].faceMeta = dice[1].faceMeta.map((f, i) => ({ ...f, label: i === 0 ? '00' : String(i * 10), contrib: i * 10 }))
      } else if (type === 'coin') {
        const spacing = 0.6
        for (let i = 0; i < qty; i++) makeDie('coin', (i - (qty - 1) / 2) * spacing * 2)
      } else {
        const spacing = qty === 1 ? 0 : qty === 2 ? 0.85 : 0.75
        for (let i = 0; i < qty; i++) makeDie(type, (i - (qty - 1) / 2) * spacing * 2.2)
      }
      idle = true; fitCamera()
    }

    function rollAll() {
      const s = stateRef.current
      if (s.rolling || !dice.length) return
      s.rolling = true; idle = false
      if (s.sound) playSound()
      const now = performance.now(); anim = []
      dice.forEach((d, i) => {
        let upVec, result
        if (d.landing === 'vertex') {
          const v = 1 + Math.floor(Math.random() * 4)
          upVec = d.verts[v - 1].clone().normalize(); result = { label: String(v), contrib: v }; d.winFace = null
        } else {
          const idx = Math.floor(Math.random() * d.faceMeta.length)
          const f = d.faceMeta[idx]; upVec = f.normal.clone().normalize(); result = { label: f.label, contrib: f.contrib }; d.winFace = f
        }
        d.result = result
        const qUp = new THREE.Quaternion().setFromUnitVectors(upVec, V(0, 1, 0))
        const yaw = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), (Math.random() * 2 - 1) * 0.5)
        const qTarget = yaw.multiply(qUp)
        const axis = V(Math.random() * 2 - 1, (Math.random() * 2 - 1) * 0.3, Math.random() * 2 - 1).normalize()
        const A = (2 + Math.floor(Math.random() * 3)) * Math.PI * 2
        const qStart = new THREE.Quaternion().setFromAxisAngle(axis, -A).multiply(qTarget.clone())
        if (d.glow) { d.glow.visible = false; d.glow.material.opacity = 0 }
        anim.push({ die: d, axis, A, qStart, qTarget, t0: now + i * 70, dur: 1050 + Math.random() * 300, hop: 0.85 + Math.random() * 0.4 })
      })
      animating = true
    }

    const easeOut = t => 1 - Math.pow(1 - t, 3)
    function tick() {
      if (animating) {
        const now = performance.now(); let done = true
        for (const a of anim) {
          let t = (now - a.t0) / a.dur
          if (t < 0) { done = false; a.die.group.quaternion.copy(a.qStart); a.die.group.position.y = 0; continue }
          if (t < 1) done = false; t = Math.min(1, t); const e = easeOut(t)
          a.die.group.quaternion.copy(new THREE.Quaternion().setFromAxisAngle(a.axis, a.A * e).multiply(a.qStart.clone()))
          a.die.group.position.y = a.hop * Math.abs(Math.sin(Math.PI * t * 2)) * (1 - t)
        }
        if (done) finishRoll()
      } else if (idle) {
        for (const d of dice) d.group.rotateY(0.005)
      } else {
        for (const d of dice) { if (d.glow && d.glow.visible && d.glow.material.opacity < 0.5) d.glow.material.opacity = Math.min(0.5, d.glow.material.opacity + 0.045) }
      }
      renderer.render(scene, camera)
    }

    function finishRoll() {
      animating = false
      for (const a of anim) { a.die.group.quaternion.copy(a.qTarget); a.die.group.position.y = 0 }
      dice.forEach(d => {
        if (d.glow && d.winFace) {
          const f = d.winFace, s2 = (d.kind === 'coin' ? f.inradius * 1.5 : f.inradius * 2.3)
          d.glow.scale.set(s2, s2, 1); d.glow.position.copy(f.centroid).addScaledVector(f.normal, 0.04)
          orientPlane(d.glow, f.normal); d.glow.material.color.copy(glowColor); d.glow.material.opacity = 0; d.glow.visible = true
        }
      })
      const s = stateRef.current; s.rolling = false

      // compute result
      const type = s.dieType
      let resultText, chipsArr, histEntry
      if (type === 'coin') {
        const words = dice.map(d => d.result.label)
        const caras = words.filter(w => w === 'Cara').length
        resultText = dice.length > 1 ? String(caras) + ' Caras' : words[0]
        chipsArr = dice.length > 1 ? words : []
        histEntry = { name: 'Moeda', parts: words, total: caras + 'C' }
      } else if (type === 100) {
        let v = dice[0].result.contrib + dice[1].result.contrib; if (v === 0) v = 100
        resultText = String(v)
        chipsArr = [dice[0].result.label + '·' + dice[1].result.label]
        histEntry = { name: 'D100', parts: chipsArr, total: v }
      } else {
        const total = dice.reduce((acc, d) => acc + d.result.contrib, 0)
        resultText = String(total)
        chipsArr = dice.length > 1 ? dice.map(d => d.result.label) : []
        histEntry = { name: 'D' + type, parts: dice.map(d => d.result.label), total }
      }
      s.history.unshift(histEntry); if (s.history.length > 20) s.history.pop()
      setUi(prev => ({ ...prev, ...s, result: resultText, chips: chipsArr }))
    }

    function playSound() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const dur = 0.18
        for (let i = 0; i < 3; i++) {
          const o = ctx.createOscillator(), g = ctx.createGain()
          o.connect(g); g.connect(ctx.destination)
          o.frequency.value = 180 + Math.random() * 120
          o.type = 'sawtooth'
          g.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.06)
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + dur)
          o.start(ctx.currentTime + i * 0.06); o.stop(ctx.currentTime + i * 0.06 + dur)
        }
      } catch (e) {}
    }

    function recolor() {
      const pal = palette()
      glowColor.copy(pal.c1.clone().lerp(new THREE.Color('#ffffff'), 0.32))
      buildDice()
    }

    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(canvas.parentElement)
    resize()
    renderer.setAnimationLoop(tick)

    threeRef.current = { buildDice, rollAll, recolor, renderer, resize }
    buildDice()

    // Link fonts
    if (document.fonts?.ready) document.fonts.ready.then(() => buildDice())
  }

  function roll() { threeRef.current?.rollAll() }

  function setDie(type) {
    stateRef.current.dieType = type
    stateRef.current.qty = type === 100 ? 2 : 1
    setUi(prev => ({ ...prev, dieType: type, qty: stateRef.current.qty, result: null, chips: [] }))
    threeRef.current?.buildDice()
  }

  function setQty(delta) {
    const s = stateRef.current
    if (s.dieType === 100) return
    s.qty = Math.max(1, Math.min(8, s.qty + delta))
    setUi(prev => ({ ...prev, qty: s.qty }))
    threeRef.current?.buildDice()
  }

  function setColor1(v) { stateRef.current.color1 = v; setUi(prev => ({ ...prev, color1: v })); threeRef.current?.recolor() }
  function setColor2(v) { stateRef.current.color2 = v; setUi(prev => ({ ...prev, color2: v })); threeRef.current?.recolor() }
  function setAngle(v) { stateRef.current.angle = v; setUi(prev => ({ ...prev, angle: v })); threeRef.current?.recolor() }
  function setMode(m) { stateRef.current.mode = m; setUi(prev => ({ ...prev, mode: m })); threeRef.current?.recolor() }
  function setFont(f) { stateRef.current.font = f; setUi(prev => ({ ...prev, font: f })); threeRef.current?.buildDice() }
  function togglePips() { stateRef.current.d6pips = !stateRef.current.d6pips; setUi(prev => ({ ...prev, d6pips: stateRef.current.d6pips })); threeRef.current?.buildDice() }

  function saveCoinFace(face, dataUrl) {
    stateRef.current.coinFaces = { ...stateRef.current.coinFaces, [face]: dataUrl }
    setUi(prev => ({ ...prev, coinFaces: { ...stateRef.current.coinFaces } }))
    threeRef.current?.buildDice()
  }
  function resetCoinFaces() {
    stateRef.current.coinFaces = { cara: null, cruz: null }
    setUi(prev => ({ ...prev, coinFaces: { cara: null, cruz: null } }))
    threeRef.current?.buildDice()
  }
  function toggleSound() { stateRef.current.sound = !stateRef.current.sound; setUi(prev => ({ ...prev, sound: stateRef.current.sound })) }

  return (
    <div className="space-y-4">
      {/* 3D canvas */}
      <div className="relative rounded-xl overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(200,169,110,0.12), transparent 55%), linear-gradient(180deg,#12151d,#090b10)', minHeight: 240 }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: 260, touchAction: 'none' }} />
        {ui.result && (
          <div className="absolute top-3 left-4 pointer-events-none">
            <div className="text-xogun-muted text-xs font-mono uppercase tracking-widest">Total</div>
            <div className="font-display text-5xl text-xogun-gold leading-none" style={{ textShadow: '0 2px 14px rgba(0,0,0,.6)' }}>{ui.result}</div>
            {ui.chips.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-1">
                {ui.chips.map((c, i) => <span key={i} className="text-xs font-mono bg-black/60 border border-xogun-border rounded px-1.5 py-0.5 text-xogun-gold">{c}</span>)}
              </div>
            )}
          </div>
        )}
        <button onClick={roll}
          className="absolute bottom-3 right-3 font-display font-bold text-sm uppercase px-5 py-3 rounded-xl border-none cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#e8c766,#c9a227 60%,#8a742f)', color: '#1a1508', boxShadow: '0 8px 22px rgba(0,0,0,.45),0 4px 12px rgba(200,162,39,.35)' }}>
          Tirar
        </button>
      </div>

      {/* Die type */}
      <div>
        <div className="text-xogun-muted text-xs font-mono uppercase tracking-wider mb-2">Tipo</div>
        <div className="flex gap-1.5 flex-wrap">
          {DIE_ORDER.map(d => (
            <button key={d} onClick={() => setDie(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${ui.dieType === d ? 'text-xogun-bg' : 'bg-xogun-surface border border-xogun-border text-xogun-muted hover:text-xogun-text'}`}
              style={ui.dieType === d ? { background: 'linear-gradient(135deg,#e8c766,#8a742f)', border: 'none' } : {}}>
              {d === 'coin' ? 'Moeda' : d === 100 ? 'D100' : 'D' + d}
            </button>
          ))}
        </div>
      </div>

      {/* Qty + options row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <div className="text-xogun-muted text-xs font-mono uppercase tracking-wider mb-1">Cantidade</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setQty(-1)} disabled={ui.qty <= 1 || ui.dieType === 100}
              className="w-8 h-8 rounded-lg border border-xogun-border bg-xogun-surface text-xogun-text disabled:opacity-30 hover:border-xogun-accent transition-colors">−</button>
            <span className="font-mono font-semibold w-8 text-center">{ui.dieType === 100 ? '2×d10' : ui.qty}</span>
            <button onClick={() => setQty(1)} disabled={ui.qty >= 8 || ui.dieType === 100}
              className="w-8 h-8 rounded-lg border border-xogun-border bg-xogun-surface text-xogun-text disabled:opacity-30 hover:border-xogun-accent transition-colors">+</button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-end pb-0.5">
          <button onClick={toggleSound} className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${ui.sound ? 'border-xogun-accent text-xogun-accent' : 'border-xogun-border text-xogun-muted'}`}>
            {ui.sound ? '🔊' : '🔇'}
          </button>
          {ui.dieType === 6 && (
            <button onClick={togglePips} className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${ui.d6pips ? 'border-xogun-accent text-xogun-accent' : 'border-xogun-border text-xogun-muted'}`}>
              {ui.d6pips ? 'Puntos' : 'Números'}
            </button>
          )}
          {ui.dieType === 'coin' && (
            <>
              <button onClick={() => setEditingFace('cara')} className="px-2.5 py-1 rounded-lg text-xs border border-xogun-border text-xogun-muted hover:border-xogun-accent hover:text-xogun-accent transition-colors">
                ✏️ Cara
              </button>
              <button onClick={() => setEditingFace('cruz')} className="px-2.5 py-1 rounded-lg text-xs border border-xogun-border text-xogun-muted hover:border-xogun-accent hover:text-xogun-accent transition-colors">
                ✏️ Cruz
              </button>
              {(ui.coinFaces?.cara || ui.coinFaces?.cruz) && (
                <button onClick={resetCoinFaces} className="px-2.5 py-1 rounded-lg text-xs border border-xogun-border text-xogun-muted hover:border-xogun-red hover:text-xogun-red transition-colors">
                  Restaurar
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Opcións avanzadas: cor e tipografía (estética, non esencial para o uso habitual) */}
      <div className="border-t border-xogun-border pt-3">
        <button onClick={() => setAdvancedOpen(a => !a)} className="text-xogun-muted text-xs font-mono uppercase tracking-wider flex items-center gap-1 hover:text-xogun-accent transition-colors">
          Opcións avanzadas <span className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`}>▾</span>
        </button>

        {advancedOpen && (
          <div className="space-y-5 mt-3 animate-fade-in">
            {/* Color */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xogun-muted text-xs font-mono uppercase tracking-wider">Cor</span>
                <div className="flex rounded-lg overflow-hidden border border-xogun-border">
                  {['solid', 'gradient'].map(m => (
                    <button key={m} onClick={() => setMode(m)}
                      className={`px-3 py-1 text-xs font-semibold transition-colors ${ui.mode === m ? 'bg-xogun-accent text-xogun-bg' : 'bg-xogun-surface text-xogun-muted'}`}>
                      {m === 'solid' ? 'Sólida' : 'Degradado'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <input type="color" value={ui.color1} onChange={e => setColor1(e.target.value)}
                  className="w-8 h-8 rounded-lg border-2 border-xogun-border cursor-pointer p-0" style={{ appearance: 'none' }} />
                {ui.mode === 'gradient' && <>
                  <input type="color" value={ui.color2} onChange={e => setColor2(e.target.value)}
                    className="w-8 h-8 rounded-lg border-2 border-xogun-border cursor-pointer p-0" />
                  <input type="range" min={0} max={360} value={ui.angle} onChange={e => setAngle(+e.target.value)}
                    className="flex-1 min-w-20" style={{ accentColor: '#c8a96e' }} />
                  <span className="text-xogun-muted text-xs font-mono w-8">{ui.angle}°</span>
                </>}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(ui.mode === 'solid' ? SOLID_SWATCHES : GRADIENT_SWATCHES).map((sw, i) => {
                  const bg = ui.mode === 'solid' ? sw : `linear-gradient(${sw.angle}deg,${sw.c1},${sw.c2})`
                  const active = ui.mode === 'solid' ? ui.color1.toLowerCase() === sw : (ui.color1 === sw.c1 && ui.color2 === sw.c2)
                  return <button key={i} onClick={() => ui.mode === 'solid' ? setColor1(sw) : (setColor1(sw.c1), setColor2(sw.c2), setAngle(sw.angle))}
                    className={`w-6 h-6 rounded-lg border-2 transition-all hover:scale-110 ${active ? 'border-white' : 'border-transparent'}`}
                    style={{ background: bg }} />
                })}
              </div>
            </div>

            {/* Font */}
            <div>
              <div className="text-xogun-muted text-xs font-mono uppercase tracking-wider mb-2">Tipografía</div>
              <div className="flex gap-1.5 flex-wrap">
                {FONTS.map(f => (
                  <button key={f.name} onClick={() => setFont(f.name)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${ui.font === f.name ? 'border-xogun-accent text-xogun-accent' : 'border-xogun-border text-xogun-muted hover:text-xogun-text'}`}
                    style={{ fontFamily: `"${f.name}", sans-serif` }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      <div className="border-t border-xogun-border pt-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setHistOpen(h => !h)} className="text-xogun-muted text-xs font-mono uppercase tracking-wider flex items-center gap-1 hover:text-xogun-accent transition-colors">
            Historial <span className={`transition-transform ${histOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {ui.history.length > 0 && <button onClick={() => { stateRef.current.history = []; setUi(prev => ({ ...prev, history: [] })) }} className="text-xogun-muted text-xs hover:text-xogun-red transition-colors underline">Limpar</button>}
        </div>
        {histOpen && (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {ui.history.length === 0
              ? <p className="text-xogun-muted text-xs font-mono text-center py-2">Aínda sen tiradas</p>
              : ui.history.map((h, i) => (
                <div key={i} className="flex justify-between text-xs font-mono py-1 border-b border-xogun-border/50">
                  <span className="text-xogun-muted">{h.name}{h.parts.length > 1 ? ' ×' + h.parts.length : ''}  →  {h.parts.join(', ')}</span>
                  <span className="text-xogun-gold font-semibold">{h.total}</span>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {editingFace && (
        <CoinFaceEditor
          label={editingFace === 'cara' ? 'Cara' : 'Cruz'}
          initialDataUrl={ui.coinFaces?.[editingFace]}
          onSave={dataUrl => saveCoinFace(editingFace, dataUrl)}
          onClose={() => setEditingFace(null)}
        />
      )}
    </div>
  )
}
