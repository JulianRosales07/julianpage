import { useState, useEffect } from 'react';
import NavBar from "../navbar/NavBar";
import './reparaciones.css';

const initialReparacionState = {
  fecha: '',
  descripcion: '',
  costo: '',
  estado: '',
  garantia: '',
  id_vehiculo: '',
  tipo_reparacion: '',
  mecanico_asignado: '',
  duracion_estimada: ''
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const ReparacionesPage = () => {
 
  const [reparaciones, setReparaciones] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(initialReparacionState);
  const [isEditing, setIsEditing] = useState(false);

  const [advancedSearch, setAdvancedSearch] = useState({
    campo1: 'estado',
    valor1: '',
    campo2: 'mecanico_asignado',
    valor2: ''
  });
  const [advancedResults, setAdvancedResults] = useState([]);

  useEffect(() => {
    const fetchReparaciones = async () => {
      try {
        const response = await fetch('https://mysql-malh.onrender.com/GasMonkey/reparaciones/traer');
        const data = await response.json();
        setReparaciones(data);
      } catch (err) {
        console.error('Error al cargar reparaciones:', err);
      }
    };
    fetchReparaciones();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSuccess = async (message) => {
    setSuccessMessage(message);
    const updatedResponse = await fetch('https://mysql-malh.onrender.com/GasMonkey/reparaciones/traer');
    setReparaciones(await updatedResponse.json());
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
      const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/reparaciones/traer/${searchId}`);
      if (!response.ok) throw new Error('Reparación no encontrada');
      setSearchResult(await response.json());
      setError(null);
    } catch (err) {
      setError(err.message);
      setSearchResult(null);
    }
  };

  const handleCreateReparacion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mysql-malh.onrender.com/GasMonkey/reparaciones/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await handleSuccess('Reparación creada exitosamente!');
        setShowCreateForm(false);
        setFormData(initialReparacionState);
      }
    } catch (error) {
      console.error('Error al crear reparación:', error);
    }
  };

  const handleEditReparacion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://mysql-malh.onrender.com/GasMonkey/reparaciones/modificar/${formData.id_reparacion}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        await handleSuccess('Reparación actualizada exitosamente!');
        setIsEditing(false);
        setFormData(initialReparacionState);
      }
    } catch (error) {
      console.error('Error al actualizar reparación:', error);
      setError('Error al actualizar la reparación');
    }
  };

  const handleDeleteReparacion = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reparación?')) {
      try {
        const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/reparaciones/eliminar/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await handleSuccess('Reparación eliminada exitosamente!');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar reparación');
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
      const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/reparaciones/buscar?${queryParams}`);

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

  
  const ReparacionRow = ({ reparacion }) => (
    <tr>
      <td>{reparacion.id_reparacion}</td>
      <td>{formatDate(reparacion.fecha)}</td>
      <td>{reparacion.descripcion}</td>
      <td>${reparacion.costo}</td>
      <td>{reparacion.estado}</td>
      <td>{reparacion.garantia}</td>
      <td>{reparacion.id_vehiculo}</td>
      <td>{reparacion.tipo_reparacion}</td>
      <td>{reparacion.mecanico_asignado}</td>
      <td>{reparacion.duracion_estimada}</td>
      <td className="actions-column">
        <button
          onClick={() => {
            setFormData(reparacion);
            setIsEditing(true);
          }}
          className="btn-edit"
        >
          Editar
        </button>
        <button
          onClick={() => handleDeleteReparacion(reparacion.id_reparacion)}
          className="btn-delete"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );

  const ReparacionDetails = ({ reparacion, title }) => (
    <div className="reparacion-details">
      {title && <h4>{title}</h4>}
      <p><strong>ID:</strong> {reparacion.id_reparacion}</p>
      <p><strong>Fecha:</strong> {formatDate(reparacion.fecha)}</p>
      <p><strong>Descripción:</strong> {reparacion.descripcion}</p>
      <p><strong>Costo:</strong> ${reparacion.costo}</p>
      <p><strong>Estado:</strong> {reparacion.estado}</p>
      <p><strong>Garantía:</strong> {reparacion.garantia}</p>
      <p><strong>ID Vehículo:</strong> {reparacion.id_vehiculo}</p>
      <p><strong>Tipo de Reparación:</strong> {reparacion.tipo_reparacion}</p>
      <p><strong>Mecánico Asignado:</strong> {reparacion.mecanico_asignado}</p>
      <p><strong>Duración Estimada:</strong> {reparacion.duracion_estimada}</p>
    </div>
  );

  const ReparacionForm = ({ onSubmit, onCancel, title }) => (
    <div className="reparacion-form">
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          {Object.entries(initialReparacionState).map(([key]) => (
            <div key={key} className="form-field">
              <label>
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
              </label>
              {key === 'descripcion' ? (
                <textarea
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <input
                  type={
                    key === 'fecha' ? 'date' :
                    key === 'costo' ? 'number' :
                    'text'
                  }
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  required
                  step={key === 'costo' ? '0.01' : undefined}
                />
              )}
            </div>
          ))}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {isEditing ? 'Guardar Cambios' : 'Guardar Reparación'}
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
              <option value="estado">Estado</option>
              <option value="mecanico_asignado">Mecánico Asignado</option>
              <option value="tipo_reparacion">Tipo de Reparación</option>
              <option value="id_vehiculo">ID Vehículo</option>
              <option value="garantia">Garantía</option>
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
              <option value="mecanico_asignado">Mecánico Asignado</option>
              <option value="estado">Estado</option>
              <option value="tipo_reparacion">Tipo de Reparación</option>
              <option value="id_vehiculo">ID Vehículo</option>
              <option value="garantia">Garantía</option>
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
                campo1: 'estado',
                valor1: '',
                campo2: 'mecanico_asignado',
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
      <div className="reparaciones-container">
        <h1 className="reparaciones-title">Gestión de Reparaciones</h1>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="table-container">
          <table className="reparaciones-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Costo</th>
                <th>Estado</th>
                <th>Garantía</th>
                <th>ID Vehículo</th>
                <th>Tipo Reparación</th>
                <th>Mecánico</th>
                <th>Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reparaciones.map(reparacion => (
                <ReparacionRow key={reparacion.id_reparacion} reparacion={reparacion} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="search-section">
          <h3>Buscar Reparación</h3>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              className="search-input"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingrese ID de la reparación"
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
          {searchResult && <ReparacionDetails reparacion={searchResult} title="Resultado de la búsqueda:" />}
        </div>

        <AdvancedSearchForm />

        {advancedResults.length > 0 && (
          <div className="search-results">
            <h3>Resultados de Búsqueda Avanzada ({advancedResults.length})</h3>
            <table className="reparaciones-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Costo</th>
                  <th>Estado</th>
                  <th>Garantía</th>
                  <th>ID Vehículo</th>
                  <th>Tipo Reparación</th>
                  <th>Mecánico</th>
                  <th>Duración</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {advancedResults.map(reparacion => (
                  <ReparacionRow key={reparacion.id_reparacion} reparacion={reparacion} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isEditing ? (
          <ReparacionForm
            onSubmit={handleEditReparacion}
            onCancel={() => {
              setIsEditing(false);
              setFormData(initialReparacionState);
            }}
            title="Editar Reparación"
          />
        ) : showCreateForm ? (
          <ReparacionForm
            onSubmit={handleCreateReparacion}
            onCancel={() => {
              setShowCreateForm(false);
              setFormData(initialReparacionState);
            }}
            title="Crear Nueva Reparación"
          />
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Agregar Nueva Reparación
          </button>
        )}
      </div>
    </div>
  );
};

export default ReparacionesPage;