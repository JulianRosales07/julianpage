import Navbar from "../navbar/NavBar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-black mb-6">
            Bienvenido a Gas Monkey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema de gestión para tu taller mecánico
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-primary-600 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-black mb-3">Clientes</h2>
              <p className="text-gray-600">Gestiona la información de tus clientes</p>
            </div>
            <div className="bg-white border-2 border-primary-600 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-black mb-3">Vehículos</h2>
              <p className="text-gray-600">Administra los vehículos en servicio</p>
            </div>
            <div className="bg-white border-2 border-primary-600 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-black mb-3">Reparaciones</h2>
              <p className="text-gray-600">Seguimiento de reparaciones y servicios</p>
            </div>
            <div className="bg-white border-2 border-primary-600 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-black mb-3">Piezas</h2>
              <p className="text-gray-600">Control de inventario de piezas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};