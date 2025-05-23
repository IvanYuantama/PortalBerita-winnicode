import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import RegisterJurnalis from "./components/RegisterJurnalis.jsx";
import LoginJurnalis from "./components/LoginJurnalis.jsx";
import DashboardUser from "./components/DashboardUser.jsx";
import BeritaUser from "./components/BeritaUser.jsx";
import DashboardJurnalis from "./components/DashboardJurnalis.jsx";
import AddBerita from "./components/AddBerita.jsx";
import EditBerita from "./components/EditBerita.jsx";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/berita/:id",
    element: <BeritaUser />,
  },
  {
    path: "/addBerita",
    element: <AddBerita />,
  },
  {
    path: "/editBerita/:id",
    element: <EditBerita />,
  },
  {
    path: "/dashboardUser",
    element: <DashboardUser />,
  },
  {
    path: "/dashboardJurnalis",
    element: <DashboardJurnalis />,
  },
  {
    path: "/registerJurnalis",
    element: <RegisterJurnalis />,
  },
  {
    path: "/loginJurnalis",
    element: <LoginJurnalis />,
  },
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/error",
    element: <ErrorBoundary />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
