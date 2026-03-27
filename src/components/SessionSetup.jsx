import React, { useState } from 'react'

const SessionSetup = ({ sessionName, setSessionName, agendas, setAgendas, onContinue, importData, localeStrings }) => {
  const [newAgenda, setNewAgenda] = useState('')

  const addAgenda = () => {
    if (!newAgenda.trim()) return
    setAgendas((prev) => [...prev, { id: Date.now(), title: newAgenda.trim() }])
    setNewAgenda('')
  }

  const removeAgenda = (id) => {
    setAgendas((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-slate-800">{localeStrings.sessionSetupTitle}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">{localeStrings.sessionName}</label>
          <input
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="دورة المجلس"
            className="mt-1 w-full input"
          />
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-slate-800 mb-2">{localeStrings.agendaTitle}</h3>
          <div className="flex gap-2">
            <input
              value={newAgenda}
              onChange={(e) => setNewAgenda(e.target.value)}
              placeholder={localeStrings.addAgendaPlaceholder}
              className="flex-1 input"
            />
            <button onClick={addAgenda} className="btn btn-primary">
              {localeStrings.addAgenda}
            </button>
          </div>
          <ul className="mt-3 space-y-1">
            {agendas.length === 0 ? (
              <li className="text-slate-500">{localeStrings.noAgenda}</li>
            ) : (
              agendas.map((a) => (
                <li key={a.id} className="rounded-md bg-white border border-slate-200 p-2 flex justify-between items-center">
                  <span>{a.title}</span>
                  <button onClick={() => removeAgenda(a.id)} className="text-rose-600 hover:text-rose-700 text-xs">
                    {localeStrings.remove}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={onContinue}
            disabled={!sessionName.trim() || agendas.length === 0}
            className="flex-1 btn btn-success"
          >
            {localeStrings.startSession}
          </button>
          <button
            onClick={() => {
              const jsonString = prompt(localeStrings.importJsonPlaceholder)
              if (jsonString) {
                importData(jsonString)
              }
            }}
            className="flex-1 btn btn-secondary"
          >
            {localeStrings.importJson}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionSetup
