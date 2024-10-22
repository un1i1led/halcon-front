import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import OrderDetail from './screens/OrderDetail';
import PrivateRouter from './components/ProtectedRoute/ProtectedRoute';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import { Notification } from './components/Notification';

function App() {

  return (
    <Router>
      <Notification/>
      <Routes>
        <Route path='/' element={<OrderDetail/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route element={<PrivateRouter/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
