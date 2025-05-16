import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold">Gas Monkey</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Inicio
                </Link>
                <Link to="/Clients" className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Clientes
                </Link>
                <Link to="/Piezas" className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Piezas
                </Link>
                <Link to="/Reparaciones" className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Reparaciones
                </Link>
                <Link to="/Vehiculos" className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Vehículos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};