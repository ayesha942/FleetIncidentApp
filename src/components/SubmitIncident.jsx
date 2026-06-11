import React, { useState } from 'react'
import { Loader2, Sparkles, CheckCircle } from 'lucide-react'

const INCIDENT_TYPES = ['Accident', 'Vehicle Damage', 'Delivery Delay', 'Customer Complaint', 'Other']
const DRIVERS = ['Ahmed Raza', 'Sara Malik', 'Bilal Hassan', 'Usman Khan', 'Kamran Ali']
const VEHICLES = ['TRK-14', 'VAN-07', 'VAN-03', 'TRK-22', 'TRK-09', 'TRK-01', 'VAN-11']

export default function SubmitIncident({ onSubmit }) {
  const [form, setForm] = useState({
    driverName: '',
    vehicleId: '',
    type: '',
    rawReport: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState(localStorage.getItem('anthropic_key') || '')
  const [showKey, setShowKey] = useState(false)

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = async () => {
    if (!form.driverName || !form.vehicleId || !form.type || !form.rawReport) {
      setError('Please fill in all fields.')
      return
    }
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key.')
      return
    }
    setError('')
    setLoading(true)
    localStorage.setItem('anthropic_key', apiKey)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
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
          messages: [
            {
              role: 'user',
              content: `You are an AI fleet incident analyzer. Analyze this incident report and return ONLY a JSON object with no markdown, no explanation.

Incident Type: ${form.type}
Driver: ${form.driverName}
Vehicle: ${form.vehicleId}
Report: ${form.rawReport}

Return this exact JSON structure:
{
  "severity": "critical" | "high" | "medium" | "low",
  "severityScore": number from 0-100,
  "rootCause": "one-line root cause",
  "suggestedAction": "specific actionable next steps for the fleet manager",
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "2-sentence plain-language summary of what happened and why it matters"
}`
            }
          ]
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || 'API error')
      }

      const data = await response.json()
      const text = data.content[0].text.trim()
      const clean = text.replace(/```json|```/g, '').trim()
      const aiAnalysis = JSON.parse(clean)

      const newIncident = {
        id: `INC-${String(Date.now()).slice(-4)}`,
        driverName: form.driverName,
        vehicleId: form.vehicleId,
        type: form.type,
        submittedAt: new Date().toISOString(),
        status: 'triaged',
        rawReport: form.rawReport,
        aiAnalysis
      }

      onSubmit(newIncident)
    } catch (err) {
      setError(`AI triage failed: ${err.message}. Check your API key.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#E8EAF0] tracking-tight">Report an Incident</h1>
        <p className="text-[#6B7280] text-sm mt-1">Submit a new incident. AI will triage it instantly.</p>
      </div>

      <div className="space-y-5">
        {/* API Key */}
        <div className="bg-[#151820] border border-[#1E2330] rounded-lg p-4">
          <label className="block text-xs text-[#6B7280] mb-2 font-medium uppercase tracking-wider">
            Anthropic API Key
          </label>
          <div className="flex gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 bg-[#0D0F14] border border-[#1E2330] rounded px-3 py-2 text-sm text-[#E8EAF0] placeholder-[#374151] focus:outline-none focus:border-[#F97316] font-mono"
            />
            <button
              onClick={() => setShowKey(v => !v)}
              className="px-3 py-2 bg-[#1E2330] text-xs text-[#6B7280] rounded hover:text-[#E8EAF0] transition-colors"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="text-xs text-[#374151] mt-1.5">
            Saved locally in your browser. Get one at console.anthropic.com
          </p>
        </div>

        {/* Driver + Vehicle */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Driver">
            <select
              value={form.driverName}
              onChange={e => set('driverName', e.target.value)}
              className="w-full bg-[#0D0F14] border border-[#1E2330] rounded px-3 py-2 text-sm text-[#E8EAF0] focus:outline-none focus:border-[#F97316]"
            >
              <option value="">Select driver</option>
              {DRIVERS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Vehicle ID">
            <select
              value={form.vehicleId}
              onChange={e => set('vehicleId', e.target.value)}
              className="w-full bg-[#0D0F14] border border-[#1E2330] rounded px-3 py-2 text-sm text-[#E8EAF0] focus:outline-none focus:border-[#F97316]"
            >
              <option value="">Select vehicle</option>
              {VEHICLES.map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
        </div>

        {/* Incident type */}
        <Field label="Incident Type">
          <div className="flex flex-wrap gap-2">
            {INCIDENT_TYPES.map(t => (
              <button
                key={t}
                onClick={() => set('type', t)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  form.type === t
                    ? 'bg-[#F97316] text-white'
                    : 'bg-[#1E2330] text-[#9CA3AF] hover:text-[#E8EAF0]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        {/* Report text */}
        <Field label="Incident Report">
          <textarea
            value={form.rawReport}
            onChange={e => set('rawReport', e.target.value)}
            placeholder="Describe exactly what happened, where, and when. Include any damage, injuries, or customer reactions..."
            rows={5}
            className="w-full bg-[#0D0F14] border border-[#1E2330] rounded px-3 py-2 text-sm text-[#E8EAF0] placeholder-[#374151] focus:outline-none focus:border-[#F97316] resize-none leading-relaxed"
          />
        </Field>

        {error && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded px-3 py-2 text-sm text-[#EF4444]">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-[#F97316] text-white rounded-lg font-medium text-sm hover:bg-[#EA6C0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              AI is triaging your incident...
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Submit & Triage with AI
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-[#6B7280] mb-2 font-medium uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}
