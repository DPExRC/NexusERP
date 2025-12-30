import React from 'react';
import AppRouter from './features/excel/routes/AppRouter';
import MainLayout from './features/excel/components/layout';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <MainLayout>
      <AppRouter />
    </MainLayout>
    </BrowserRouter>
  );
}

export default App;