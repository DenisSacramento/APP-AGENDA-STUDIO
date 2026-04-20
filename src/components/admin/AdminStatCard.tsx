import { Card } from '../ui/Card'

interface AdminStatCardProps {
  title: string
  value: number
}

export const AdminStatCard = ({ title, value }: AdminStatCardProps) => (
  <Card className="space-y-1">
    <p className="text-sm font-medium text-zinc-600">{title}</p>
    <p className="text-3xl font-black text-rose-900">{value}</p>
  </Card>
)
