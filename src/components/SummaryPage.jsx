import React from 'react'

const formatDateTime = (timestamp) => {
  if (!timestamp) return '--:--:--'
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const SummaryPage = ({ members, agendas, timerStartTime, timerStopTime, localeStrings }) => {
  const presentCount = members.filter((m) => m.present).length
  const absentCount = members.length - presentCount
  
  // Only count as "definitely left" if their last action was an exit (didn't come back)
  const leftMembers = members.filter((m) => {
    if (m.exitTimes.length === 0) return false // no exits at all
    if (m.checkInTimes.length === 0) return true // exits but no check-ins
    
    // Check if last action was an exit (not a check-in after exit)
    const lastCheckIn = m.checkInTimes[m.checkInTimes.length - 1]
    const lastExit = m.exitTimes[m.exitTimes.length - 1]
    
    return lastExit > lastCheckIn // only if last action was exit
  })

  const agendaResults = agendas.map((agenda) => {
    const counts = { yes: 0, no: 0, abstain: 0 }
    members.forEach((m) => {
      const vote = m.votes?.[agenda.id]
      if (vote) counts[vote] += 1
    })
    return { ...agenda, counts }
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-100 rounded-xl border border-emerald-200 shadow-sm">
          <div className="text-slate-600">{localeStrings.totalPresent}</div>
          <div className="text-3xl font-bold text-emerald-700">{presentCount}</div>
        </div>
        <div className="p-4 bg-amber-100 rounded-xl border border-amber-200 shadow-sm">
          <div className="text-slate-600">{localeStrings.totalAbsent}</div>
          <div className="text-3xl font-bold text-amber-700">{absentCount}</div>
        </div>
        <div className="p-4 bg-rose-100 rounded-xl border border-rose-200 shadow-sm">
          <div className="text-slate-600">{localeStrings.leftRoom}</div>
          <div className="text-3xl font-bold text-rose-700">{leftMembers.length}</div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
        <h3 className="font-semibold mb-2"> توقيت الدورة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600">وقت البدء: </span>
            <span className="font-semibold ml-2">{formatDateTime(timerStartTime)}</span>
          </div>
          <div>
            <span className="text-slate-600">وقت التوقف: </span>
            <span className="font-semibold ml-2">{formatDateTime(timerStopTime)}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold mb-2">{localeStrings.leftMembers}</h3>
        {leftMembers.length === 0 ? (
          <p>{localeStrings.noOneLeft}</p>
        ) : (
          <ul className="list-disc pl-5">{leftMembers.map((m) => <li key={m.id}>{m.name}</li>)}</ul>
        )}
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        {agendaResults.map((agenda) => (
          <div key={agenda.id} className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm">
            <h4 className="font-semibold mb-2">{agenda.title}</h4>
            <div className="grid grid-cols-3 gap-2 text-sm text-slate-700">
              <div className="text-emerald-700">{localeStrings.yes}: {agenda.counts.yes}</div>
              <div className="text-rose-700">{localeStrings.no}: {agenda.counts.no}</div>
              <div className="text-slate-700">{localeStrings.abstain}: {agenda.counts.abstain}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default SummaryPage
