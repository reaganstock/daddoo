import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  }
]);
