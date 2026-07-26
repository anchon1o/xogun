import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCatalogMeta() {
  const [categories, setCategories] = useState([])
  const [mechanics, setMechanics]   = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('game_categories').select('*').eq('active', true).order('sort_order'),
      supabase.from('game_mechanics').select('*').eq('active', true).order('sort_order'),
    ]).then(([cats, mechs]) => {
      setCategories(cats.data || [])
      setMechanics(mechs.data || [])
      setLoading(false)
    })
  }, [])

  function getCategoryName(id) { return categories.find(c => c.id === id)?.name || '' }
  function getMechanicName(id) { return mechanics.find(m => m.id === id)?.name || '' }

  return { categories, mechanics, loading, getCategoryName, getMechanicName }
}
