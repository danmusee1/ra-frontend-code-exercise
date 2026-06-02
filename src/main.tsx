import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './app/app';

const container = document.getElementById('root');
if (container === null) throw Error('Missing "root" element');

ReactDOM.createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
