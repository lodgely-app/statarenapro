import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { useTenant } from './context/TenantContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';

const AppRoutes = () => {
  const { isGlobal, isLoading, error } = useTenant();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#F2F4F7] z-[100] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-4 shadow-xl animate-pulse">
            <img src="/favicon.png" alt="StatArena Logo" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -inset-4 border-2 border-sofa-blue/20 rounded-[2rem] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="text-sm font-black text-sofa-navy uppercase tracking-[0.3em] animate-pulse">
            StatArena Pro
          </span>
          <span className="text-[10px] font-bold text-sofa-muted uppercase tracking-[0.2em] opacity-40">
            Tournament Intelligence
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sofa-bg flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-black text-sofa-live mb-2">Tenant Not Found</h1>
        <p className="text-sofa-muted">{error}</p>
        <a href="http://lvh.me:5173" className="mt-6 bg-sofa-blue text-white px-6 py-2 rounded-lg font-bold">Go Home</a>
      </div>
    );
  }

  if (isGlobal) {
    if (location.pathname === '/register') {
      return <Register />;
    }
    return <Landing />;
  }

  return (
    <Outlet />
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppRoutes />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: 'register',
        element: null,
      },
      {
        path: 'admin/*',
        element: <AdminPage />,
      }
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
