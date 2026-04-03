// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TestProvider } from './context/TestContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <TestProvider>
      <App />
    </TestProvider>
  </AuthProvider>
);