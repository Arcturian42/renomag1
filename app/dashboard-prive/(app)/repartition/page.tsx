import { getLeads, getUsers, getKpis, getLeadsBySource, getLeadsByCampaign, getLeadsByStatus, getLeadsByPeriod, getLeadsByCity } from '@/lib/data/dashboard'
import KpiCards from '@/components/dashboard/KpiCards'
import LeadCharts from '@/components/dashboard/LeadCharts'

export default async function RepartitionPage() {
  const [users, leads] = await Promise.all([getUsers(), getLeads()])
  const kpis = getKpis(users, leads)

  const bySource = getLeadsBySource(leads)
  const byCampaign = getLeadsByCampaign(leads)
  const byStatus = getLeadsByStatus(leads)
  const byPeriod = getLeadsByPeriod(leads)
  const byCity = getLeadsByCity(leads)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Répartition des leads</h1>
        <p className="text-slate-500 mt-1">Analysez la répartition et les performances de vos leads</p>
      </div>

      <KpiCards kpis={kpis} />

      <LeadCharts
        bySource={bySource}
        byCampaign={byCampaign}
        byStatus={byStatus}
        byPeriod={byPeriod}
        byCity={byCity}
      />
    </div>
  )
}
