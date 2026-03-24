import React from 'react'

const formatTime = (seconds) => {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0')
  const sec = String(seconds % 60).padStart(2, '0')
  return `${min}:${sec}`
}

const TimerControls = ({ timerSeconds, onStart, onStop, onReset, localeStrings }) => (
  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center mt-3 mb-4">
    <div className="col-span-3 py-3 px-4 rounded-md border border-slate-300 bg-white text-center">
      <span className="font-semibold">{localeStrings.sessionTimer}:</span>{' '}
      <span className="text-lg font-bold">{formatTime(timerSeconds)}</span>
    </div>
    <button onClick={onStart} className="col-span-1 py-2 rounded-md btn btn-success">
      {localeStrings.start}
    </button>
    <button onClick={onStop} className="col-span-1 py-2 rounded-md btn btn-secondary">
      {localeStrings.stop}
    </button>
    <button onClick={onReset} className="col-span-1 py-2 rounded-md btn btn-danger">
      {localeStrings.resetSession}
    </button>
  </div>
)

export default TimerControls
