import { useState, useEffect } from 'react';
import NavBar from "../navbar/NavBar";
import './clients.css';

const initialClientState = {
  nombre: '',
  telefono: '',
  direccion: '',
  correo: '',
  fecha_registro: '',
  documento_identidad: '',
  ciudad: '',
  edad: '',
  genero: ''
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const ClientsPage = () => {
  
  const [clientes, setClientes] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(initialClientState);
  const [isEditing, setIsEditing] = useState(false);

  const [advancedSearch, setAdvancedSearch] = useState({
    campo1: 'nombre',
    valor1: '',
    campo2: 'ciudad',
    valor2: ''
  });
  const [advancedResults, setAdvancedResults] = useState([]);

 
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("https://mysql-malh.onrender.com/GasMonkey/clientes/traer");
        const data = await response.json();
        setClientes(data);
      } catch (err) {
        console.error('Error al cargar clientes:', err);
      }
    };
    fetchClientes();
  }, []);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSuccess = async (message) => {
    setSuccessMessage(message);
    const updatedResponse = await fetch('https://mysql-malh.onrender.com/GasMonkey/clientes/traer');
    setClientes(await updatedResponse.json());
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
      const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/clientes/traer/${searchId}`);
      if (!response.ok) throw new Error('Cliente no encontrado');
      setSearchResult(await response.json());
      setError(null);
    } catch (err) {
      setError(err.message);
      setSearchResult(null);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const { id_cliente, ...clientData } = formData;
      const response = await fetch('https://mysql-malh.onrender.com/GasMonkey/clientes/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        await handleSuccess('Cliente creado exitosamente!');
        setShowCreateForm(false);
        setFormData(initialClientState);
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  const handleEditClient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://mysql-malh.onrender.com/GasMonkey/clientes/modificar/${formData.id_cliente}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        await handleSuccess('Cliente actualizado exitosamente!');
        setIsEditing(false);
        setFormData(initialClientState);
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      setError('Error al actualizar el cliente');
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/clientes/eliminar/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await handleSuccess('Cliente eliminado exitosamente!');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar cliente');
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
      const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/clientes/buscar?${queryParams}`);

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

 
  const ClientRow = ({ cliente }) => (
    <tr>
      <td>{cliente.id_cliente}</td>
      <td>{cliente.nombre}</td>
      <td>{cliente.documento_identidad}</td>
      <td>{cliente.telefono}</td>
      <td>{cliente.direccion}</td>
      <td>{cliente.correo}</td>
      <td>{cliente.ciudad}</td>
      <td>{cliente.edad}</td>
      <td>
        {cliente.genero === 'M' ? 'Masculino' :
          cliente.genero === 'F' ? 'Femenino' : cliente.genero}
      </td>
      <td>{formatDate(cliente.fecha_registro)}</td>
      <td className="actions-column">
        <button
          onClick={() => {
            setFormData(cliente);
            setIsEditing(true);
          }}
          className="btn-edit"
        >
          Editar
        </button>
        <button
          onClick={() => handleDeleteClient(cliente.id_cliente)}
          className="btn-delete"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );

  const ClientDetails = ({ cliente, title }) => (
    <div className="client-details">
      {title && <h4>{title}</h4>}
      <p><strong>ID:</strong> {cliente.id_cliente}</p>
      <p><strong>Nombre:</strong> {cliente.nombre}</p>
      <p><strong>Documento:</strong> {cliente.documento_identidad}</p>
      <p><strong>Teléfono:</strong> {cliente.telefono}</p>
      <p><strong>Dirección:</strong> {cliente.direccion}</p>
      <p><strong>Correo:</strong> {cliente.correo}</p>
      <p><strong>Ciudad:</strong> {cliente.ciudad}</p>
      <p><strong>Edad:</strong> {cliente.edad}</p>
      <p><strong>Género:</strong>
        {cliente.genero === 'M' ? 'Masculino' :
          cliente.genero === 'F' ? 'Femenino' : cliente.genero}
      </p>
      <p><strong>Fecha de Registro:</strong> {formatDate(cliente.fecha_registro)}</p>
    </div>
  );

  const ClientForm = ({ onSubmit, onCancel, title }) => (
    <div className="client-form">
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          {Object.entries(initialClientState).map(([key]) => (
            <div key={key} className="form-field">
              <label>
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
              </label>

              {key === 'genero' ? (
                <select
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              ) : (
                <input
                  type={
                    key === 'fecha_registro' ? 'date' :
                      key === 'edad' ? 'number' :
                        key === 'correo' ? 'email' : 'text'
                  }
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  required={key !== 'id_cliente'}
                />
              )}
            </div>
          ))}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {isEditing ? 'Guardar Cambios' : 'Guardar Cliente'}
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
              <option value="nombre">Nombre</option>
              <option value="documento_identidad">Documento</option>
              <option value="ciudad">Ciudad</option>
              <option value="genero">Género</option>
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
              <option value="ciudad">Ciudad</option>
              <option value="nombre">Nombre</option>
              <option value="documento_identidad">Documento</option>
              <option value="genero">Género</option>
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
                campo1: 'nombre',
                valor1: '',
                campo2: 'ciudad',
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
      <div className="clients-container">
        <h1 className="clients-title">Gestión de Clientes</h1>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="table-container">
          <table className="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Correo</th>
                <th>Ciudad</th>
                <th>Edad</th>
                <th>Género</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <ClientRow key={cliente.id_cliente} cliente={cliente} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="search-section">
          <h3>Buscar Cliente</h3>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              className="search-input"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingrese ID del cliente"
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
          {searchResult && <ClientDetails cliente={searchResult} title="Resultado de la búsqueda:" />}
        </div>

        <AdvancedSearchForm />

        {advancedResults.length > 0 && (
          <div className="search-results">
            <h3>Resultados de Búsqueda Avanzada ({advancedResults.length})</h3>
            <table className="clients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Correo</th>
                  <th>Ciudad</th>
                  <th>Edad</th>
                  <th>Género</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {advancedResults.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td>{cliente.id_cliente}</td>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.documento_identidad}</td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.direccion}</td>
                    <td>{cliente.correo}</td>
                    <td>{cliente.ciudad}</td>
                    <td>{cliente.edad}</td>
                    <td>
                      {cliente.genero === 'M' ? 'Masculino' :
                        cliente.genero === 'F' ? 'Femenino' : cliente.genero}
                    </td>
                    <td>{formatDate(cliente.fecha_registro)}</td>
                    <td>
                      <button
                        onClick={() => {
                          setFormData(cliente);
                          setIsEditing(true);
                        }}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClient(cliente.id_cliente)}
                        className="btn-delete"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isEditing ? (
          <ClientForm
            onSubmit={handleEditClient}
            onCancel={() => {
              setIsEditing(false);
              setFormData(initialClientState);
            }}
            title="Editar Cliente"
          />
        ) : showCreateForm ? (
          <ClientForm
            onSubmit={handleCreateClient}
            onCancel={() => {
              setShowCreateForm(false);
              setFormData(initialClientState);
            }}
            title="Crear Nuevo Cliente"
          />
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Agregar Nuevo Cliente
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;