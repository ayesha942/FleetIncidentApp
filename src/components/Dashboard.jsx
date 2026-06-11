import React, { useState } from 'react'
import { AlertTriangle, Clock, CheckCircle, Filter } from 'lucide-react'

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export default function Dashboard({ incidents, onSelectIncident }) {
  const [filter, setFilter] = useState('all')

  const stats = {
    total: incidents.length,
    critical: incidents.filter(i => i.aiAnalysis?.severity === 'critical').length,
    pending: incidents.filter(i => i.status === 'new').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
  }

  const filtered = incidents
    .filter(i => {
      if (filter === 'all') return true
      if (filter === 'pending') return i.status === 'new'
      if (filter === 'critical') return i.aiAnalysis?.severity === 'critical'
      return i.aiAnalysis?.severity === filter
    })
    .sort((a, b) => {
      const sa = SEVERITY_ORDER[a.aiAnalysis?.severity] ?? 99
      const sb = SEVERITY_ORDER[b.aiAnalysis?.severity] ?? 99
      return sa - sb
    })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#E8EAF0] tracking-tight">Incident Feed</h1>
        <p className="text-[#6B7280] text-sm mt-1">All incidents, AI-triaged and ranked by severity</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Incidents" value={stats.total} color="#6B7280" />
        <StatCard label="Critical" value={stats.critical} color="#EF4444" pulse={stats.critical > 0} />
        <StatCard label="Pending Triage" value={stats.pending} color="#EAB308" />
        <StatCard label="Resolved" value={stats.resolved} color="#22C55E" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5">
        <Filter size={13} className="text-[#6B7280]" />
        {['all', 'pending', 'critical', 'high', 'medium', 'low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all capitalize ${
              filter === f
                ? 'bg-[#1E2330] text-[#E8EAF0] border border-[#2E3545]'
                : 'text-[#6B7280] hover:text-[#E8EAF0]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Incident list */}
      <div className="space-y-2">
        {filtered.map(incident => (
          <IncidentRow key={incident.id} incident={incident} onClick={() => onSelectIncident(incident)} />
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, color, pulse }) {
  return (
    <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {pulse && <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />}
        <span className="text-xs text-[#6B7280]">{label}</span>
      </div>
      <div className="text-3xl font-semibold font-mono" style={{ color }}>{value}</div>
    </div>
  )
}

function IncidentRow({ incident, onClick }) {
  const { aiAnalysis, id, driverName, vehicleId, type, submittedAt, status } = incident
  const severity = aiAnalysis?.severity
  const isPending = status === 'new'

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 1) return 'Just now'
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs/24)}d ago`
  }

  return (
    <div
      onClick={onClick}
      className="bg-[#151820] border border-[#1E2330] rounded-lg p-4 cursor-pointer hover:border-[#2E3545] hover:bg-[#191C24] transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Severity indicator */}
          <div className="flex flex-col items-center gap-1 mt-0.5 shrink-0">
            <div className={`w-2 h-2 rounded-full ${
              severity === 'critical' ? 'bg-[#EF4444] animate-pulse' :
              severity === 'high' ? 'bg-[#F97316]' :
              severity === 'medium' ? 'bg-[#EAB308]' :
              severity === 'low' ? 'bg-[#22C55E]' :
              'bg-[#374151]'
            }`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#6B7280]">{id}</span>
              <span className="text-xs text-[#6B7280]">•</span>
              <span className="text-sm font-medium text-[#E8EAF0]">{type}</span>
              {isPending && (
                <span className="px-2 py-0.5 rounded text-xs bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                  Needs triage
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-[#6B7280]">
              <span>{driverName}</span>
              <span>·</span>
              <span className="font-mono">{vehicleId}</span>
              <span>·</span>
              <span>{timeAgo(submittedAt)}</span>
            </div>

            {aiAnalysis && (
              <p className="text-xs text-[#9CA3AF] mt-2 line-clamp-1">{aiAnalysis.summary}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {severity && (
            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize badge-${severity}`}>
              {severity}
            </span>
          )}
          {aiAnalysis?.severityScore && (
            <div className="text-right">
              <div className="font-mono text-sm font-semibold" style={{
                color: severity === 'critical' ? '#EF4444' :
                       severity === 'high' ? '#F97316' :
                       severity === 'medium' ? '#EAB308' : '#22C55E'
              }}>
                {aiAnalysis.severityScore}
              </div>
              <div className="text-[10px] text-[#6B7280]">score</div>
            </div>
          )}
          <span className="text-[#374151] group-hover:text-[#6B7280] text-lg transition-colors">›</span>
        </div>
      </div>
    </div>
  )
}
