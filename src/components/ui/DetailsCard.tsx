interface DetailItem {
  label: string
  value: React.ReactNode
}

interface DetailsCardProps {
  items: DetailItem[]
}

export function DetailsCard({ items }: DetailsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center px-6 py-4"
        >
          <span className="text-zinc-400 text-sm">{item.label}</span>
          <span className="text-white font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  )
}