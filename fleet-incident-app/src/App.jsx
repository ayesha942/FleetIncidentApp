import React, { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import SubmitIncident from './components/SubmitIncident.jsx'
import IncidentDetail from './components/IncidentDetail.jsx'
import PatternsPanel from './components/PatternsPanel.jsx'
import { sampleIncidents } from './data/incidents.js'
import { AlertTriangle, LayoutDashboard, Plus, TrendingUp, Truck } from 'lucide-react'

export default function App() {
  const [view, setView] = useState('dashboard')
  const [incidents, setIncidents] = useState(sampleIncidents)
  const [selectedIncident, setSelectedIncident] = useState(null)

  const handleNewIncident = (incident) => {
    setIncidents(prev => [incident, ...prev])
    setView('dashboard')
  }

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident)
    setView('detail')
  }

  const handleUpdateIncident = (updated) => {
    setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i))
    setSelectedIncident(updated)
  }

  const newCount = incidents.filter(i => i.status === 'new').length
  const criticalCount = incidents.filter(i => i.aiAnalysis?.severity === 'critical').length

  return (
    <div className="min-h-screen bg-[#0D0F14]">
      {/* Top nav */}
      <header className="border-b border-[#1E2330] bg-[#151820] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#F97316] rounded flex items-center justify-center">
              <Truck size={14} className="text-white" />
            </div>
            <span className="font-semibold text-[#E8EAF0] tracking-tight">FleetIQ</span>
            <span className="text-[#6B7280] text-xs font-mono ml-1">Incident Intelligence</span>
          </div>

          <nav className="flex items-center gap-1">
            <NavBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={14}/>} label="Dashboard" />
            <NavBtn active={view === 'patterns'} onClick={() => setView('patterns')} icon={<TrendingUp size={14}/>} label="Patterns" />
            <NavBtn active={view === 'submit'} onClick={() => setView('submit')} icon={<Plus size={14}/>} label="Report Incident" accent />
          </nav>

          <div className="flex items-center gap-4">
            {newCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-[#EAB308]">
                <AlertTriangle size={13} />
                <span>{newCount} pending triage</span>
              </div>
            )}
            {criticalCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-[#EF4444]">
                <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                <span>{criticalCount} critical</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'dashboard' && (
          <Dashboard
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
          />
        )}
        {view === 'submit' && (
          <SubmitIncident onSubmit={handleNewIncident} />
        )}
        {view === 'detail' && selectedIncident && (
          <IncidentDetail
            incident={selectedIncident}
            onBack={() => setView('dashboard')}
            onUpdate={handleUpdateIncident}
          />
        )}
        {view === 'patterns' && (
          <PatternsPanel incidents={incidents} />
        )}
      </main>
    </div>
  )
}

function NavBtn({ active, onClick, icon, label, accent }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
        accent
          ? 'bg-[#F97316] text-white hover:bg-[#EA6C0A]'
          : active
          ? 'bg-[#1E2330] text-[#E8EAF0]'
          : 'text-[#6B7280] hover:text-[#E8EAF0] hover:bg-[#1E2330]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
