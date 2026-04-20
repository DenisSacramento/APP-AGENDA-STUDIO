import { Card } from '../ui/Card'

interface AdminStatCardProps {
  title: string
  value: number
}

export const AdminStatCard = ({ title, value }: AdminStatCardProps) => (
  <div className="rounded-3xl border border-[#ddb1cf] bg-[#f1e6f3] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_18px_rgba(87,52,73,0.08)]">
    <p className="text-sm font-medium text-[#6c5574]">{title}</p>
    <p className="text-3xl font-black text-[#8e005f]">{value}</p>
  </div>
)
