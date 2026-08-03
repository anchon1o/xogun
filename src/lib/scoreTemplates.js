export const TEMPLATE_PRESETS = [
  {
    name: 'Xenérico (rondas simples)',
    scoreSections: [],
  },
  {
    name: 'Catan',
    scoreSections: [
      { id: 'settlements', label: 'Poboados', type: 'number' },
      { id: 'cities',      label: 'Cidades',  type: 'number' },
      { id: 'roads',       label: 'Estrada máis longa', type: 'number' },
      { id: 'army',        label: 'Exército máis grande', type: 'number' },
      { id: 'cards',       label: 'Cartas de desenvolvemento', type: 'number' },
    ],
  },
  {
    name: 'Ticket to Ride',
    scoreSections: [
      { id: 'routes',    label: 'Rutas completadas', type: 'number' },
      { id: 'tickets',   label: 'Billetes destino', type: 'number' },
      { id: 'longest',   label: 'Ruta máis longa (bonus)', type: 'number' },
    ],
  },
  {
    name: 'Wingspan',
    scoreSections: [
      { id: 'birds',     label: 'Paxaros', type: 'number' },
      { id: 'bonus',     label: 'Cartas bonus', type: 'number' },
      { id: 'endround',  label: 'Obxectivos de rolda', type: 'number' },
      { id: 'eggs',      label: 'Ovos', type: 'number' },
      { id: 'food',      label: 'Comida almacenada', type: 'number' },
      { id: 'tucked',    label: 'Cartas gardadas', type: 'number' },
    ],
  },
]

export function calculateSectionTotal(sectionValues) {
  return Object.values(sectionValues || {}).reduce((sum, v) => sum + (Number(v) || 0), 0)
}
