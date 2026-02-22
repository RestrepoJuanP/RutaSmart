import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import ParentLayout from './components/ParentLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleSetup from './pages/VehicleSetup';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import RouteMap from './pages/RouteMap';
import BoardingVerification from './pages/BoardingVerification';
import Finances from './pages/Finances';
import Maintenance from './pages/Maintenance';
import Notifications from './pages/Notifications';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import Tracking from './pages/parent/Tracking';
import Invoices from './pages/parent/Invoices';
import ParentProfile from './pages/parent/ParentProfile';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  // Conductor Routes
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'vehicle',
        Component: VehicleSetup,
      },
      {
        path: 'students',
        Component: Students,
      },
      {
        path: 'attendance',
        Component: Attendance,
      },
      {
        path: 'boarding',
        Component: BoardingVerification,
      },
      {
        path: 'route',
        Component: RouteMap,
      },
      {
        path: 'finances',
        Component: Finances,
      },
      {
        path: 'maintenance',
        Component: Maintenance,
      },
      {
        path: 'notifications',
        Component: Notifications,
      },
    ],
  },
  // Parent/Acudiente Routes
  {
    path: '/parent',
    Component: ParentLayout,
    children: [
      {
        index: true,
        Component: ParentDashboard,
      },
      {
        path: 'tracking',
        Component: Tracking,
      },
      {
        path: 'invoices',
        Component: Invoices,
      },
      {
        path: 'notifications',
        Component: Notifications,
      },
      {
        path: 'profile',
        Component: ParentProfile,
      },
    ],
  },
]);