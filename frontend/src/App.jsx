import React from 'react'
import Navbar from './components/Navbar/Navbar'

const App = () => {
  return (
    <div className='min-h-screen bg-gray-600 text-white text-[50px] flex flex-col items-center justify-start'>
      <Navbar />
      <h1>Home Page</h1>
    </div>
  )
}

export default App