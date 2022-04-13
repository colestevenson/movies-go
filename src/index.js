import React from 'react';
import AppFunc from './AppFunc';import { createRoot } from 'react-dom/client';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppFunc tab="/" />);