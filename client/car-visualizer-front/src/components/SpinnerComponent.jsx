import React from 'react'

function SpinnerComponent() {
  return (
    <div style={{ zIndex: 1000 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>
  )
}
export default SpinnerComponent