import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import './index.css';
import { queryClient } from './lib/query-client';
import { router } from './route/route-tree';

const container = document.getElementById('root');
if (container === null) throw Error('Missing "root" element');

ReactDOM.createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
