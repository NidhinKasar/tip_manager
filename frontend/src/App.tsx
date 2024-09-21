import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignupPage from './pages/Signup'; // Assuming your SignupPage is inside the `pages` directory
import LoginPage from './pages/Login'; // Similarly, your LoginPage
import HomePage from './pages/TipMain'; // Placeholder Home Page after successful login

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
