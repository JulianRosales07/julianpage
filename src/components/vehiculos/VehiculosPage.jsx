import { useState, useEffect } from 'react';
import NavBar from "../navbar/NavBar";
import './vehiculos.css';

const initialVehiculoState = {
  marca: '',
  modelo: '',
  anio: '',
  placa: '',
  color: '',
  tipo: '',
  id_cliente: '',
  kilometraje: '',
  transmision: '',
  motor: ''
};

const VehiculosPage = () => {
  
  const [vehiculos, setVehiculos] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(initialVehiculoState);
  const [isEditing, setIsEditing] = useState(false);

  const [advancedSearch, setAdvancedSearch] = useState({
    campo1: 'marca',
    valor1: '',
    campo2: 'color',
    valor2: ''
  });
  const [advancedResults, setAdvancedResults] = useState([]);

  
  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await fetch('https://mysql-malh.onrender.com/GasMonkey/vehiculos/traer');
        const data = await response.json();
        setVehiculos(data);
      } catch (err) {
        console.error('Error al cargar vehículos:', err);
      }
    };
    fetchVehiculos();
  }, []);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSuccess = async (message) => {
    setSuccessMessage(message);
    const updatedResponse = await fetch('https://mysql-malh.onrender.com/GasMonkey/vehiculos/traer');
    setVehiculos(await updatedResponse.json());
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setError('Por favor ingrese un ID válido');
      setSearchResult(null);
      return;
    }

    try {
      const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/vehiculos/traer/${searchId}`);
      if (!response.ok) throw new Error('Vehículo no encontrado');
      setSearchResult(await response.json());
      setError(null);
    } catch (err) {
      setError(err.message);
      setSearchResult(null);
    }
  };

  const handleCreateVehiculo = async (e) => {
    e.preventDefault();
    try {
      const { id_vehiculo, ...vehiculoData } = formData;
      const response = await fetch('https://mysql-malh.onrender.com/GasMonkey/vehiculos/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoData),
      });

      if (response.ok) {
        await handleSuccess('Vehículo creado exitosamente!');
        setShowCreateForm(false);
        setFormData(initialVehiculoState);
      }
    } catch (error) {
      console.error('Error al crear vehículo:', error);
    }
  };

  const handleEditVehiculo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://mysql-malh.onrender.com/GasMonkey/vehiculos/modificar/${formData.id_vehiculo}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        await handleSuccess('Vehículo actualizado exitosamente!');
        setIsEditing(false);
        setFormData(initialVehiculoState);
      }
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      setError('Error al actualizar el vehículo');
    }
  };

  const handleDeleteVehiculo = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/vehiculos/eliminar/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await handleSuccess('Vehículo eliminado exitosamente!');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar vehículo');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleAdvancedSearch = async (e) => {
    e.preventDefault();

    if (!advancedSearch.valor1 || !advancedSearch.valor2) {
      setError('Ambos valores de búsqueda son requeridos');
      return;
    }

    try {
      const queryParams = new URLSearchParams(advancedSearch).toString();
      const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/vehiculos/buscar?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la búsqueda');
      }

      const results = await response.json();
      setAdvancedResults(results);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAdvancedResults([]);
    }
  };

  
  const VehiculoRow = ({ vehiculo }) => (
    <tr>
      <td>{vehiculo.id_vehiculo}</td>
      <td>{vehiculo.marca}</td>
      <td>{vehiculo.modelo}</td>
      <td>{vehiculo.anio}</td>
      <td>{vehiculo.placa}</td>
      <td>{vehiculo.color}</td>
      <td>{vehiculo.tipo}</td>
      <td>{vehiculo.id_cliente}</td>
      <td>{vehiculo.kilometraje}</td>
      <td>{vehiculo.transmision}</td>
      <td>{vehiculo.motor}</td>
      <td className="actions-column">
        <button
          onClick={() => {
            setFormData(vehiculo);
            setIsEditing(true);
          }}
          className="btn-edit"
        >
          Editar
        </button>
        <button
          onClick={() => handleDeleteVehiculo(vehiculo.id_vehiculo)}
          className="btn-delete"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );

  const VehiculoDetails = ({ vehiculo, title }) => (
    <div className="vehiculo-details">
      {title && <h4>{title}</h4>}
      <p><strong>ID:</strong> {vehiculo.id_vehiculo}</p>
      <p><strong>Marca:</strong> {vehiculo.marca}</p>
      <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
      <p><strong>Año:</strong> {vehiculo.anio}</p>
      <p><strong>Placa:</strong> {vehiculo.placa}</p>
      <p><strong>Color:</strong> {vehiculo.color}</p>
      <p><strong>Tipo:</strong> {vehiculo.tipo}</p>
      <p><strong>ID Cliente:</strong> {vehiculo.id_cliente}</p>
      <p><strong>Kilometraje:</strong> {vehiculo.kilometraje}</p>
      <p><strong>Transmisión:</strong> {vehiculo.transmision}</p>
      <p><strong>Motor:</strong> {vehiculo.motor}</p>
    </div>
  );

  const VehiculoForm = ({ onSubmit, onCancel, title }) => (
    <div className="vehiculo-form">
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          {Object.entries(initialVehiculoState).map(([key]) => (
            <div key={key} className="form-field">
              <label>
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
              </label>

              {key === 'tipo' ? (
                <select
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Deportivo">Deportivo</option>
                  <option value="Motocicleta">Motocicleta</option>
                </select>
              ) : key === 'transmision' ? (
                <select
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Manual">Manual</option>
                  <option value="Automática">Automática</option>
                  <option value="CVT">CVT</option>
                  <option value="Secuencial">Secuencial</option>
                </select>
              ) : (
                <input
                  type={
                    key === 'anio' || key === 'kilometraje' ? 'number' : 'text'
                  }
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  required={key !== 'id_vehiculo'}
                />
              )}
            </div>
          ))}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {isEditing ? 'Guardar Cambios' : 'Guardar Vehículo'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );

  const AdvancedSearchForm = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setAdvancedSearch(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
      <div className="advanced-search">
        <h3>Búsqueda Avanzada</h3>
        <form onSubmit={handleAdvancedSearch}>
          <div className="search-pair">
            <select
              name="campo1"
              value={advancedSearch.campo1}
              onChange={handleInputChange}
            >
              <option value="marca">Marca</option>
              <option value="modelo">Modelo</option>
              <option value="color">Color</option>
              <option value="tipo">Tipo</option>
              <option value="id_cliente">ID Cliente</option>
            </select>
            <input
              type="text"
              name="valor1"
              value={advancedSearch.valor1}
              onChange={handleInputChange}
              placeholder="Valor a buscar"
            />
          </div>
          
          <div className="search-pair">
            <select
              name="campo2"
              value={advancedSearch.campo2}
              onChange={handleInputChange}
            >
              <option value="color">Color</option>
              <option value="marca">Marca</option>
              <option value="modelo">Modelo</option>
              <option value="tipo">Tipo</option>
              <option value="anio">Año</option>
            </select>
            <input
              type="text"
              name="valor2"
              value={advancedSearch.valor2}
              onChange={handleInputChange}
              placeholder="Valor a buscar"
            />
          </div>
          
          <button type="submit" className="btn-primary">
            Buscar
          </button>
          <button 
            type="button" 
            onClick={() => {
              setAdvancedSearch({
                campo1: 'marca',
                valor1: '',
                campo2: 'color',
                valor2: ''
              });
              setAdvancedResults([]);
            }}
            className="btn-secondary"
          >
            Limpiar
          </button>
        </form>
      </div>
    );
  };

  return (
    <div>
      <NavBar />
      <div className="vehiculos-container">
        <h1 className="vehiculos-title">Gestión de Vehículos</h1>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="table-container">
          <table className="vehiculos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Placa</th>
                <th>Color</th>
                <th>Tipo</th>
                <th>ID Cliente</th>
                <th>Kilometraje</th>
                <th>Transmisión</th>
                <th>Motor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map(vehiculo => (
                <VehiculoRow key={vehiculo.id_vehiculo} vehiculo={vehiculo} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="search-section">
          <h3>Buscar Vehículo</h3>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              className="search-input"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingrese ID del vehículo"
            />
            <button type="submit" className="btn-primary">
              Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchId('');
                setSearchResult(null);
                setError(null);
              }}
              className="btn-secondary"
            >
              Limpiar
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {searchResult && <VehiculoDetails vehiculo={searchResult} title="Resultado de la búsqueda:" />}
        </div>

        <AdvancedSearchForm />

        {advancedResults.length > 0 && (
          <div className="search-results">
            <h3>Resultados de Búsqueda Avanzada ({advancedResults.length})</h3>
            <table className="vehiculos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Placa</th>
                  <th>Color</th>
                  <th>Tipo</th>
                  <th>ID Cliente</th>
                  <th>Kilometraje</th>
                  <th>Transmisión</th>
                  <th>Motor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {advancedResults.map(vehiculo => (
                  <VehiculoRow key={vehiculo.id_vehiculo} vehiculo={vehiculo} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isEditing ? (
          <VehiculoForm
            onSubmit={handleEditVehiculo}
            onCancel={() => {
              setIsEditing(false);
              setFormData(initialVehiculoState);
            }}
            title="Editar Vehículo"
          />
        ) : showCreateForm ? (
          <VehiculoForm
            onSubmit={handleCreateVehiculo}
            onCancel={() => {
              setShowCreateForm(false);
              setFormData(initialVehiculoState);
            }}
            title="Crear Nuevo Vehículo"
          />
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Agregar Nuevo Vehículo
          </button>
        )}
      </div>
    </div>
  );
};

export default VehiculosPage;