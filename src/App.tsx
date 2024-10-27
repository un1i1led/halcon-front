import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import DashboardLayout from './components/Layout/DashboardLayout';
import { RoleBasedRoute } from './components/ProtectedRoute/RoleBasedRoute';
import Login from './screens/Login';
import theme from './theme';
import { Notification } from './components/Notification';
import OrderDetail from './screens/OrderDetail';
import Dashboard from './screens/Dashboard';
import Users from './screens/Users';
import Customers from './screens/Customers';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Notification />
        <Routes>
          <Route path="/" element={<OrderDetail />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RoleBasedRoute allowedRoles={
            ['admin', 'sales', 'purchasing', 'warehouse', 'route']
          } />}>
            <Route
              path="/*"
              element={
                <DashboardLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                      <Route path="/users" element={<Users />} />
                      <Route path="/customers" element={<Customers />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
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