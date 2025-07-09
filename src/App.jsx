import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/OverView'
import Pots from './pages/Pots'
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainLayout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/pots' element={<Pots />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;