import React from 'react';
import { TenantProvider } from './context/TenantContext';
import { AppRouter } from './routes';

function App() {
  return (
    <TenantProvider>
      <AppRouter />
    </TenantProvider>
  );
}

export default App;
