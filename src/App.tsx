import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import BlackBeltProgram from './pages/BlackBeltProgram'
import Classes from './pages/Classes'
import Home from './pages/Home'
import Instructors from './pages/Instructors'
import MartialArtsProgram from './pages/MartialArtsProgram'
import NotFound from './pages/NotFound'
import Programs from './pages/Programs'
import Schedule from './pages/Schedule'
import SummerCamp from './pages/SummerCamp'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="classes" element={<Classes />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programs/white-to-black" element={<MartialArtsProgram />} />
          <Route path="programs/black-belt-advanced" element={<BlackBeltProgram />} />
          <Route path="summer-camp" element={<SummerCamp />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
