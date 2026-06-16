export interface ActivityItem {
  title: string
  description: string
  expectedOutcome: string
}

interface Props {
  label: string
  data: ActivityItem
}

export default function ActivityItemCard({ label, data }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full rounded px-4 py-2 text-sm font-bold bg-outline-variant text-on-surface-variant">{label}</div>
      <p className="text-sm font-medium text-on-surface-variant">{data.title}</p>
      <p className="text-sm text-on-surface leading-relaxed">{data.description}</p>
      <div className="mt-auto pt-4 border-t border-outline-variant">
        <p className="text-xs font-semibold text-on-surface mb-2">기대 효과</p>
        <p className="text-xs text-on-surface-variant leading-relaxed">{data.expectedOutcome}</p>
      </div>
    </div>
  )
}
