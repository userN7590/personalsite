import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Experience from './pages/Experience'
import Changelog from './pages/Changelog'
import WordLoot from './pages/cases/WordLoot'
import WTM from './pages/cases/WTM'
import SimpleRents from './pages/cases/SimpleRents'
import Aire from './pages/cases/Aire'
import Minecraft from './pages/cases/Minecraft'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/wordloot" element={<WordLoot />} />
        <Route path="/projects/wtm" element={<WTM />} />
        <Route path="/projects/simple-rents" element={<SimpleRents />} />
        {/* backwards-compatible alias for the old URL */}
        <Route path="/projects/rentalcrm" element={<Navigate to="/projects/simple-rents" replace />} />
        <Route path="/projects/aire" element={<Aire />} />
        <Route path="/projects/minecraft" element={<Minecraft />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
