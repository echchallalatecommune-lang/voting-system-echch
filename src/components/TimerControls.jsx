import React, { useState, useEffect } from 'react'

const formatTime = (seconds) => {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0')
  const sec = String(seconds % 60).padStart(2, '0')
  return `${min}:${sec}`
}

const formatCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const formatStartTime = (timestamp) => {
  if (!timestamp) return '--:--:--'
  const startTime = new Date(timestamp)
  const hours = String(startTime.getHours()).padStart(2, '0')
  const minutes = String(startTime.getMinutes()).padStart(2, '0')
  const seconds = String(startTime.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const TimerControls = ({ timerSeconds, timerStartTime, timerStopTime, onStart, onStop, onReset, localeStrings }) => {
  const [currentTime, setCurrentTime] = useState(formatCurrentTime())

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(formatCurrentTime())
    }, 1000)
    return () => clearInterval(timerId)
  }, [])

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط الجلسة؟ سيتم حذف جميع البيانات.')) {
      onReset()
    }
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 items-center mt-3 mb-4">
      <div className="col-span-3 py-3 px-4 rounded-md border border-slate-300 bg-white text-center">
        <div className="text-sm text-slate-600 mb-1">الوقت الحالي: {currentTime}</div>
        <div className="text-sm text-slate-600 mb-1">وقت البدء: {formatStartTime(timerStartTime)}</div>
        <div className="text-sm text-slate-600 mb-1">وقت التوقف: {formatStartTime(timerStopTime)}</div>
        <div className="text-lg font-bold">{formatTime(timerSeconds)}</div>
      </div>
      <button onClick={onStart} className="col-span-1 py-2 rounded-md btn btn-success">
        {localeStrings.start}
      </button>
      <button onClick={onStop} className="col-span-1 py-2 rounded-md btn btn-secondary">
        {localeStrings.stop}
      </button>
      <button onClick={handleReset} className="col-span-1 py-2 rounded-md btn btn-danger">
        {localeStrings.resetSession}
      </button>
    </div>
  )
}

export default TimerControls
