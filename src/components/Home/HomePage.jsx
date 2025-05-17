import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../navbar/NavBar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Gas Monkey
            </h1>
            <p className="text-xl mb-8">
              Tu taller mecánico de confianza con tecnología de punta
            </p>
            <Link to="/Clients" className="btn-primary text-lg px-8 py-3">
              Comenzar
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-gray-600 text-lg">
            Ofrecemos una amplia gama de servicios para mantener tu vehículo en óptimas condiciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/Clients" className="transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white border-2 border-primary-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-primary-600 text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-black mb-3">Clientes</h3>
              <p className="text-gray-600">Gestiona la información de tus clientes de manera eficiente</p>
            </div>
          </Link>

          <Link to="/Vehiculos" className="transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white border-2 border-primary-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-primary-600 text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-black mb-3">Vehículos</h3>
              <p className="text-gray-600">Control completo sobre los vehículos en servicio</p>
            </div>
          </Link>

          <Link to="/Reparaciones" className="transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white border-2 border-primary-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-primary-600 text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-black mb-3">Reparaciones</h3>
              <p className="text-gray-600">Seguimiento detallado de reparaciones y servicios</p>
            </div>
          </Link>

          <Link to="/Piezas" className="transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white border-2 border-primary-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-primary-600 text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-black mb-3">Piezas</h3>
              <p className="text-gray-600">Inventario actualizado de todas las piezas disponibles</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black text-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué elegir Gas Monkey?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Servicio Rápido</h3>
              <p className="text-gray-300">Diagnóstico y reparación eficiente para que vuelvas a la carretera lo antes posible</p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold mb-3">Expertos Calificados</h3>
              <p className="text-gray-300">Equipo de mecánicos profesionales con años de experiencia</p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-3">Tecnología Avanzada</h3>
              <p className="text-gray-300">Utilizamos las últimas herramientas y equipos de diagnóstico</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-primary-600">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Clientes Satisfechos</div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-primary-600">
            <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
            <div className="text-gray-600">Reparaciones Exitosas</div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-primary-600">
            <div className="text-4xl font-bold text-primary-600 mb-2">15+</div>
            <div className="text-gray-600">Años de Experiencia</div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-primary-600">
            <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-gray-600">Soporte Técnico</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8">
            Únete a los cientos de clientes satisfechos que confían en Gas Monkey
          </p>
          <Link to="/Clients" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
            Registrar Cliente
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;