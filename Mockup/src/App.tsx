import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';
import { seedDemoData, seedComprobantes } from './lib/seedData';

export default function App() {
  useEffect(() => {
    // Initialize demo data on first load
    seedDemoData();
    seedComprobantes();
  }, []);

  return <RouterProvider router={router} />;
}