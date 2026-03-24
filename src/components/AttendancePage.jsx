import React from 'react'

const formatDateTime = (timestamp) => new Date(timestamp).toLocaleString()

const AttendancePage = ({ members, onMarkPresent, onMarkAbsent, onMarkLeft, localeStrings }) => {
  if (members.length === 0) {
    return <p className="text-center py-4">{localeStrings.noMembers}</p>
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div key={member.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-md">
          <div className="md:col-span-2">
            <div className="font-semibold text-lg">{member.name}</div>
            <div className="text-sm mt-1">
              <span className={member.present ? 'text-emerald-600' : 'text-rose-600'}>
                {localeStrings.status}: {member.present ? localeStrings.present : localeStrings.absent}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              <div className="mb-1 font-semibold">السجل:</div>
              {member.checkInTimes.length === 0 && member.exitTimes.length === 0 ? (
                <span>لا توجد حركة بعد</span>
              ) : (
                <div className="space-y-0.5">
                  {member.checkInTimes.map((time, idx) => (
                    <div key={`in-${idx}`}>✓ حضور: {formatDateTime(time)}</div>
                  ))}
                  {member.exitTimes.map((time, idx) => (
                    <div key={`out-${idx}`}>✕ مغادرة: {formatDateTime(time)}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-2 justify-start md:justify-end">
            <button onClick={() => onMarkPresent(member.id)} className="px-3 py-2 btn btn-success shadow-sm">
              {localeStrings.present}
            </button>
            <button onClick={() => onMarkAbsent(member.id)} className="px-3 py-2 btn btn-secondary shadow-sm">
              {localeStrings.absent}
            </button>
            <button onClick={() => onMarkLeft(member.id)} className="px-3 py-2 btn btn-danger shadow-sm">
              {localeStrings.leftRoom}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AttendancePage
