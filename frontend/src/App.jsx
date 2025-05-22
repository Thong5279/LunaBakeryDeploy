import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout/>}>
          {/* user layout */}
        </Route>
        <Route>{/* admin layout */}</Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App