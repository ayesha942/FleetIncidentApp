import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, AlertTriangle, Truck, User } from 'lucide-react'

export default function PatternsPanel({ incidents }) {
  // Driver incident counts
  const driverMap = {}
  incidents.forEach(i => {
    if (!driverMap[i.driverName]) driverMap[i.driverName] = { name: i.driverName, total: 0, critical: 0, high: 0, medium: 0, low: 0 }
    driverMap[i.driverName].total++
    const sev = i.aiAnalysis?.severity
    if (sev) driverMap[i.driverName][sev]++
  })
  const driverData = Object.values(driverMap).sort((a, b) => b.total - a.total)

  // Vehicle incident counts
  const vehicleMap = {}
  incidents.forEach(i => {
    if (!vehicleMap[i.vehicleId]) vehicleMap[i.vehicleId] = { id: i.vehicleId, count: 0 }
    vehicleMap[i.vehicleId].count++
  })
  const vehicleData = Object.values(vehicleMap).sort((a, b) => b.count - a.count)

  // Incident types
  const typeMap = {}
  incidents.forEach(i => {
    if (!typeMap[i.type]) typeMap[i.type] = { type: i.type, count: 0 }
    typeMap[i.type].count++
  })
  const typeData = Object.values(typeMap)
  const TYPE_COLORS = { 'Accident': '#EF4444', 'Vehicle Damage': '#F97316', 'Delivery Delay': '#EAB308', 'Customer Complaint': '#6B7280', 'Other': '#374151' }

  // Repeat offenders
  const repeatDrivers = driverData.filter(d => d.total >= 2)
  const repeatVehicles = vehicleData.filter(v => v.count >= 2)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#151820] border border-[#2E3545] rounded px-3 py-2 text-xs text-[#E8EAF0]">
        <div className="font-medium mb-1">{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.fill || p.color }}>{p.name}: {p.value}</div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#E8EAF0] tracking-tight">Incident Patterns</h1>
        <p className="text-[#6B7280] text-sm mt-1">Spot repeat offenders, risky vehicles, and systemic issues</p>
      </div>

      {/* Repeat alerts */}
      {(repeatDrivers.length > 0 || repeatVehicles.length > 0) && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          {repeatDrivers.map(d => (
            <div key={d.name} className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle size={16} className="text-[#EF4444] shrink-0" />
              <div>
                <div className="text-sm font-medium text-[#EF4444]">{d.name}</div>
                <div className="text-xs text-[#9CA3AF]">{d.total} incidents this period — review recommended</div>
              </div>
            </div>
          ))}
          {repeatVehicles.map(v => (
            <div key={v.id} className="bg-[#F97316]/10 border border-[#F97316]/20 rounded-lg p-4 flex items-center gap-3">
              <Truck size={16} className="text-[#F97316] shrink-0" />
              <div>
                <div className="text-sm font-medium text-[#F97316] font-mono">{v.id}</div>
                <div className="text-xs text-[#9CA3AF]">{v.count} incidents — schedule inspection</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Driver chart */}
        <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-5">
            <User size={13} className="text-[#6B7280]" />
            <h2 className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Incidents by Driver</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={driverData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="critical" stackId="a" fill="#EF4444" name="Critical" radius={0} />
              <Bar dataKey="high" stackId="a" fill="#F97316" name="High" radius={0} />
              <Bar dataKey="medium" stackId="a" fill="#EAB308" name="Medium" radius={0} />
              <Bar dataKey="low" stackId="a" fill="#22C55E" name="Low" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Type pie */}
        <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={13} className="text-[#6B7280]" />
            <h2 className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Incident Types</h2>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={typeData} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {typeData.map((entry) => (
                    <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#374151'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {typeData.map(t => (
                <div key={t.type} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: TYPE_COLORS[t.type] || '#374151' }} />
                  <span className="text-xs text-[#9CA3AF]">{t.type}</span>
                  <span className="text-xs text-[#6B7280] font-mono ml-auto pl-3">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle chart */}
        <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-5 col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Truck size={13} className="text-[#6B7280]" />
            <h2 className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Incidents by Vehicle</h2>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={vehicleData} margin={{ left: 0, right: 20 }}>
              <XAxis dataKey="id" tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" name="Incidents" radius={[3, 3, 0, 0]}>
                {vehicleData.map((entry, i) => (
                  <Cell key={i} fill={entry.count >= 2 ? '#F97316' : '#2E3545'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#6B7280] mt-2">Highlighted vehicles have 2+ incidents</p>
        </div>
      </div>
    </div>
  )
}
