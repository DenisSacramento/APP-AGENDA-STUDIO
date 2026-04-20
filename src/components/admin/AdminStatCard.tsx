import { Card } from '../ui/Card'

interface AdminStatCardProps {
  title: string
  value: number
}

export const AdminStatCard = ({ title, value }: AdminStatCardProps) => (
  <Card className="p-3 sm:p-4">
    <div className="space-y-1">
      <p className="text-sm font-medium text-[#6c5574]">{title}</p>
      <p className="text-lg sm:text-2xl md:text-3xl font-black text-[#8e005f]">{value}</p>
    </div>
  </Card>
)
