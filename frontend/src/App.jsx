import { Routes, Route } from 'react-router-dom' 
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/OverView'
import Pots from './pages/Pots'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import RecurringBills from './pages/RecurringBills'
import './App.css'

function App() {
    return (
            <Routes>
                <Route path='/' element={<MainLayout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/pots' element={<Pots />} />
                    <Route path='/transactions' element={<Transactions />} />
                    <Route path='/budgets' element={<Budgets />} />
                    <Route path='/recurring-bills' element={<RecurringBills />} />
                </Route>
            </Routes>
    )
}

export default App;