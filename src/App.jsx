import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './components/Home/HomePage'
import ClientsPage from './components/Clientes/ClientsPage'
import PiezasPage from './components/Piezas/PiezasPage'
import ReparacionesPage from "./components/Reparaciones/ReparacionesPage"
import VehiculosPage from "./components/vehiculos/VehiculosPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/Clients",
    element: <ClientsPage />
  },
  {
    path: "/Piezas",
    element: <PiezasPage />
  },
  {
    path: "/Reparaciones",
    element: <ReparacionesPage />
  },
  {
    path: "/Vehiculos",
    element: <VehiculosPage />
  }
]);

function App() {

  return (
    <React.Fragment>
      <RouterProvider router={router} />
    </React.Fragment>
  )
}

export default App