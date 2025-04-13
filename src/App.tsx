import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import SubmitItem from './pages/SubmitItem';
import ItemsList from './pages/ItemsList';
import MyClaims from './pages/MyClaims';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="submit-item" element={<SubmitItem />} />
          <Route path="items" element={<ItemsList />} />
          <Route path="my-claims" element={<MyClaims />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;