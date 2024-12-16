import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Preview from './pages/preview.astro';
import Celebration from './pages/celebration.astro';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/preview',
    element: <Preview />,
  },
  {
    path: '/celebration',
    element: <Celebration />,
  },
]);
