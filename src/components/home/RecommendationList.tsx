import { AlertTriangle, Clock, Droplets, Info } from 'lucide-react'
import { ActionCard } from '../ui/ActionCard'

interface RecommendationListProps {
  recommendations: string[]
}

function iconFor(text: string) {
  const lower = text.toLowerCase()
  if (lower.includes('agua') || lower.includes('hidrat')) return Droplets
  if (lower.includes('salir') || lower.includes('horario') || lower.includes('entre las')) return Clock
  if (lower.includes('mareo') || lower.includes('confus') || lower.includes('náuse') || lower.includes('alerta')) {
    return AlertTriangle
  }
  return Info
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) return null

  return (
    <div>
      <h2 className="mb-2 text-[13px] font-semibold text-[var(--color-secondary-label)]">Para hoy</h2>
      <div className="flex flex-col gap-3">
        {recommendations.map((text) => (
          <ActionCard key={text} icon={iconFor(text)} text={text} />
        ))}
      </div>
    </div>
  )
}
