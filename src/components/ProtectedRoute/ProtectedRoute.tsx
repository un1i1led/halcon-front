import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouter = () => {
  const auth = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
  return auth ? <Outlet/> : <Navigate to='/login'/>;
}

export default PrivateRouter;