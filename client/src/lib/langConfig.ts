import { type Language } from '@/lib/mockData'

export const LANG_CONFIG: Record<Language, { color: string; bg: string; label: string }> = {
  TypeScript: { color: '#3B82F6', bg: '#3B82F614', label: 'TS' },
  JavaScript: { color: '#F59E0B', bg: '#F59E0B14', label: 'JS' },
  Python:     { color: '#10B981', bg: '#10B98114', label: 'Py' },
  Go:         { color: '#22D3EE', bg: '#22D3EE14', label: 'Go' },
  Rust:       { color: '#F97316', bg: '#F9731614', label: 'Rs' },
  Java:       { color: '#EF4444', bg: '#EF444414', label: 'Jv' },
  CSS:        { color: '#8B5CF6', bg: '#8B5CF614', label: 'CSS' },
  MDX:        { color: '#EC4899', bg: '#EC489914', label: 'MDX' },
}
