import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { SavingsCalculatorPage } from './SavingsCalculatorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SavingsCalculatorPage />,
    errorElement: <div>알 수 없는 오류가 발생했어요</div>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace={true} />,
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
