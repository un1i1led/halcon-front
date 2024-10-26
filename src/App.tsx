import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import theme from './theme';
import PrivateRouter from './components/ProtectedRoute/ProtectedRoute';
import { Notification } from './components/Notification';
import OrderDetail from './screens/OrderDetail';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Notification />
        <Routes>
          <Route path='/' element={<OrderDetail/>}/>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRouter />}>
            <Route
              path="/*"
              element={
                <DashboardLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Routes>
                </DashboardLayout>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;