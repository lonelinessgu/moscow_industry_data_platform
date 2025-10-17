import { useState } from 'react';
import React, { lazy, Suspense } from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Конфигурация маршрутов
const routeConfig = [
  { path: "/login", component: lazy(() => import("./pages/LoginIn")), protected: false },
  { path: "/logout", component: lazy(() => import("./pages/LogOut")), protected: false },
  { path: "/", component: lazy(() => import("./pages/Main")), protected: true },
  { path: "/create", component: lazy(() => import("./pages/CreateNewUser")), protected: true, allowedRoles: ['admin'] },
];

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const LoginRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
};

// Функция для создания маршрута
const createRoute = (route) => {
  let element = <route.component />;

  if (route.protected) {
    element = (
      <ProtectedRoute allowedRoles={route.allowedRoles}>
        <route.component />
      </ProtectedRoute>
    );
  }

  if (route.path === "/login") {
    element = (
      <LoginRoute>
        <route.component />
      </LoginRoute>
    );
  }

  return (
    <Route
      key={route.path}
      path={route.path}
      element={element}
    />
  );
};

// Компонент, который использует location для ключа Routes
const RoutesWithLocationKey = () => {
  const location = useLocation();

  return (
    <Routes key={location.key}>
      {routeConfig.map(createRoute)}
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <RoutesWithLocationKey />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;