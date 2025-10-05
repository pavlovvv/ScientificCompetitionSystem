import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from 'features/auth/LoginForm.tsx';
import RegisterForm from 'features/auth/RegisterForm.tsx';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/auth/login" element={<LoginForm />} />
      <Route path="/auth/register" element={<RegisterForm />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
