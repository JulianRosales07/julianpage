import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="text-xl font-medium">Navbar</div>
          <div className="ml-10 flex space-x-8">
            <Link to="/" className="px-2 py-1 hover:text-gray-300">Inicio</Link>
            <Link to="/Clients" className="px-2 py-1 hover:text-gray-300">Clientes</Link>
            <Link to="/Piezas" className="px-2 py-1 hover:text-gray-300">Piezas</Link>
            <Link to="/Reparaciones" className="px-2 py-1 hover:text-gray-300">Reparaciones</Link>
            <Link to="/Vehiculos" className="px-2 py-1 hover:text-gray-300">Vehiculos</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;