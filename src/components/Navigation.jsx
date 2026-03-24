import React from 'react'

const Navigation = ({ currentPage, onNavigate, localeStrings }) => {
  return (
    <nav className="flex flex-wrap justify-center gap-2 bg-slate-50 p-3 rounded-lg shadow-sm mb-4">
      {['attendance', 'voting', 'summary'].map((page) => (
        <button
          key={page}
          onClick={() => onNavigate(page)}
          className={`px-4 py-2 rounded-md font-medium text-sm ${
            currentPage === page
              ? 'btn btn-primary'
              : 'bg-white text-slate-700 border border-slate-300'
          }`}
        >
          {localeStrings[page]}
        </button>
      ))}
    </nav>
  )
}

export default Navigation
