import React, { useState } from 'react'
import { ArrowLeft, Loader2, Sparkles, Tag, Zap, AlertTriangle, CheckCircle } from 'lucide-react'

export default function IncidentDetail({ incident, onBack, onUpdate }) {
  const { aiAnalysis, id, driverName, vehicleId, type, submittedAt, status, rawReport } = incident
  const [loading, setLoading] = useState(false)
  const [apiKey] = useState(localStorage.getItem('anthropic_key') || '')
  const [error, setError] = useState('')
  const [resolved, setResolved] = useState(status === 'resolved')

  const severity = aiAnalysis?.severity

  const runTriage = async () => {
    if (!apiKey) { setError('No API key found. Submit a new incident first to set it.'); return }
    setLoading(true); setError('')
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', { //generate ur api key 
      // const response = await fetch('yourkey()', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an AI fleet incident analyzer. Analyze this incident and return ONLY JSON, no markdown.

Type: ${type}
Driver: ${driverName}
Vehicle: ${vehicleId}
Report: ${rawReport}

Return:
{
  "severity": "critical"|"high"|"medium"|"low",
  "severityScore": 0-100,
  "rootCause": "one-line cause",
  "suggestedAction": "specific next steps",
  "tags": ["tag1","tag2","tag3"],
  "summary": "2-sentence summary"
}`
          }]
        })
      })
      const data = await response.json()
      const text = data.content[0].text.replace(/```json|```/g, '').trim()
      const aiAnalysis = JSON.parse(text)
      onUpdate({ ...incident, aiAnalysis, status: 'triaged' })
    } catch (e) {
      setError('Triage failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleResolved = () => {
    const newStatus = resolved ? 'triaged' : 'resolved'
    setResolved(!resolved)
    onUpdate({ ...incident, status: newStatus })
  }

  const fmt = (s) => new Date(s).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#E8EAF0] text-sm mb-6 transition-colors">
        <ArrowLeft size={14} />
        Back to dashboard
      </button>

      {/* Header */}
      <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#6B7280]">{id}</span>
              {severity && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize badge-${severity}`}>
                  {severity}
                </span>
              )}
              {resolved && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                  Resolved
                </span>
              )}
            </div>
            <h1 className="text-xl font-semibold text-[#E8EAF0]">{type}</h1>
          </div>

          {aiAnalysis?.severityScore && (
            <div className="text-right">
              <div className={`text-4xl font-mono font-bold severity-${severity}`}>
                {aiAnalysis.severityScore}
              </div>
              <div className="text-xs text-[#6B7280]">severity score</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <InfoItem label="Driver" value={driverName} />
          <InfoItem label="Vehicle" value={vehicleId} mono />
          <InfoItem label="Submitted" value={fmt(submittedAt)} />
        </div>
      </div>

      {/* Raw report */}
      <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-5 mb-5">
        <h2 className="text-xs text-[#6B7280] uppercase tracking-wider mb-3 font-medium">Driver's Report</h2>
        <p className="text-[#9CA3AF] text-sm leading-relaxed">{rawReport}</p>
      </div>

      {/* AI Analysis */}
      {aiAnalysis ? (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={13} className="text-[#F97316]" />
              <h2 className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">AI Summary</h2>
            </div>
            <p className="text-[#E8EAF0] text-sm leading-relaxed">{aiAnalysis.summary}</p>
          </div>

          {/* Root cause + action */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={13} className="text-[#EAB308]" />
                <h2 className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Root Cause</h2>
              </div>
              <p className="text-[#E8EAF0] text-sm">{aiAnalysis.rootCause}</p>
            </div>

            <div className="bg-[#151820] border border-[#F97316]/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={13} className="text-[#F97316]" />
                <h2 className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Recommended Action</h2>
              </div>
              <p className="text-[#E8EAF0] text-sm leading-relaxed">{aiAnalysis.suggestedAction}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={13} className="text-[#6B7280]" />
              <h2 className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Tags</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiAnalysis.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-[#1E2330] text-[#9CA3AF] text-xs rounded font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Mark resolved */}
          <button
            onClick={toggleResolved}
            className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              resolved
                ? 'bg-[#1E2330] text-[#6B7280] hover:text-[#E8EAF0]'
                : 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 hover:bg-[#22C55E]/20'
            }`}
          >
            <CheckCircle size={15} />
            {resolved ? 'Mark as Active' : 'Mark as Resolved'}
          </button>
        </div>
      ) : (
        <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-8 text-center">
          <Sparkles size={24} className="text-[#374151] mx-auto mb-3" />
          <p className="text-[#6B7280] text-sm mb-4">This incident hasn't been triaged yet.</p>
          {error && <p className="text-[#EF4444] text-xs mb-3">{error}</p>}
          <button
            onClick={runTriage}
            disabled={loading}
            className="px-6 py-2.5 bg-[#F97316] text-white rounded-lg text-sm font-medium hover:bg-[#EA6C0A] transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {loading ? <><Loader2 size={13} className="animate-spin" /> Triaging...</> : <><Sparkles size={13} /> Run AI Triage</>}
          </button>
        </div>
      )}
    </div>
  )
}

function InfoItem({ label, value, mono }) {
  return (
    <div>
      <div className="text-xs text-[#6B7280] mb-1">{label}</div>
      <div className={`text-sm text-[#E8EAF0] ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}
