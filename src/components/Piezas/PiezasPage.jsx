import { useState, useEffect } from 'react';
import NavBar from "../navbar/NavBar";
import './piezas.css';

const initialPiezaState = {
  nombre: '',
  precio: '',
  stock: '',
  proveedor: '',
  fecha_ingreso: '',
  categoria: '',
  marca: '',
  modelo_compatible: '',
  garantia: '',
  peso: ''
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const PiezasPage = () => {
  
  const [piezas, setPiezas] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(initialPiezaState);
  const [isEditing, setIsEditing] = useState(false);

  const [advancedSearch, setAdvancedSearch] = useState({
    campo1: 'nombre',
    valor1: '',
    campo2: 'categoria',
    valor2: ''
  });
  const [advancedResults, setAdvancedResults] = useState([]);

  
  useEffect(() => {
    const fetchPiezas = async () => {
      try {
        const response = await fetch('https://mysql-malh.onrender.com/GasMonkey/piezas/traer');
        const data = await response.json();
        setPiezas(data);
      } catch (err) {
        console.error('Error al cargar piezas:', err);
      }
    };
    fetchPiezas();
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSuccess = async (message) => {
    setSuccessMessage(message);
    const updatedResponse = await fetch('https://mysql-malh.onrender.com/GasMonkey/piezas/traer');
    setPiezas(await updatedResponse.json());
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
      const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/piezas/traer/${searchId}`);
      if (!response.ok) throw new Error('Pieza no encontrada');
      setSearchResult(await response.json());
      setError(null);
    } catch (err) {
      setError(err.message);
      setSearchResult(null);
    }
  };

  const handleCreatePieza = async (e) => {
    e.preventDefault();
    try {
      const { id_pieza, ...piezaData } = formData;
      const response = await fetch('https://mysql-malh.onrender.com/GasMonkey/piezas/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(piezaData),
      });

      if (response.ok) {
        await handleSuccess('Pieza creada exitosamente!');
        setShowCreateForm(false);
        setFormData(initialPiezaState);
      }
    } catch (error) {
      console.error('Error al crear pieza:', error);
    }
  };

  const handleEditPieza = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://mysql-malh.onrender.com/GasMonkey/piezas/modificar/${formData.id_pieza}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        await handleSuccess('Pieza actualizada exitosamente!');
        setIsEditing(false);
        setFormData(initialPiezaState);
      }
    } catch (error) {
      console.error('Error al actualizar pieza:', error);
      setError('Error al actualizar la pieza');
    }
  };

  const handleDeletePieza = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pieza?')) {
      try {
        const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/piezas/eliminar/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await handleSuccess('Pieza eliminada exitosamente!');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar pieza');
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
      const response = await fetch(`https://mysql-malh.onrender.com/GasMonkey/piezas/buscar?${queryParams}`);

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

  
  const PiezaRow = ({ pieza }) => (
    <tr>
      <td>{pieza.id_pieza}</td>
      <td>{pieza.nombre}</td>
      <td>{pieza.categoria}</td>
      <td>{pieza.marca}</td>
      <td>{pieza.modelo_compatible}</td>
      <td>${pieza.precio}</td>
      <td>{pieza.stock}</td>
      <td>{pieza.proveedor}</td>
      <td>{pieza.garantia}</td>
      <td>{pieza.peso} kg</td>
      <td>{formatDate(pieza.fecha_ingreso)}</td>
      <td className="actions-column">
        <button
          onClick={() => {
            setFormData(pieza);
            setIsEditing(true);
          }}
          className="btn-edit"
        >
          Editar
        </button>
        <button
          onClick={() => handleDeletePieza(pieza.id_pieza)}
          className="btn-delete"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );

  const PiezaDetails = ({ pieza, title }) => (
    <div className="pieza-details">
      {title && <h4>{title}</h4>}
      <p><strong>ID:</strong> {pieza.id_pieza}</p>
      <p><strong>Nombre:</strong> {pieza.nombre}</p>
      <p><strong>Categoría:</strong> {pieza.categoria}</p>
      <p><strong>Marca:</strong> {pieza.marca}</p>
      <p><strong>Modelo Compatible:</strong> {pieza.modelo_compatible}</p>
      <p><strong>Precio:</strong> ${pieza.precio}</p>
      <p><strong>Stock:</strong> {pieza.stock}</p>
      <p><strong>Proveedor:</strong> {pieza.proveedor}</p>
      <p><strong>Garantía:</strong> {pieza.garantia}</p>
      <p><strong>Peso:</strong> {pieza.peso} kg</p>
      <p><strong>Fecha de Ingreso:</strong> {formatDate(pieza.fecha_ingreso)}</p>
    </div>
  );

  const PiezaForm = ({ onSubmit, onCancel, title }) => (
    <div className="pieza-form">
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          {Object.entries(initialPiezaState).map(([key]) => (
            <div key={key} className="form-field">
              <label>
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
              </label>
              <input
                type={
                  key === 'fecha_ingreso' ? 'date' :
                  key === 'precio' || key === 'stock' || key === 'peso' ? 'number' :
                  'text'
                }
                name={key}
                value={formData[key] || ''}
                onChange={handleInputChange}
                required={key !== 'id_pieza'}
                step={key === 'precio' ? '0.01' : key === 'peso' ? '0.1' : undefined}
              />
            </div>
          ))}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {isEditing ? 'Guardar Cambios' : 'Guardar Pieza'}
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
              <option value="categoria">Categoría</option>
              <option value="marca">Marca</option>
              <option value="modelo_compatible">Modelo Compatible</option>
              <option value="proveedor">Proveedor</option>
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
              <option value="categoria">Categoría</option>
              <option value="nombre">Nombre</option>
              <option value="marca">Marca</option>
              <option value="modelo_compatible">Modelo Compatible</option>
              <option value="proveedor">Proveedor</option>
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
                campo2: 'categoria',
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
      <div className="piezas-container">
        <h1 className="piezas-title">Gestión de Piezas</h1>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="table-container">
          <table className="piezas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Modelo Compatible</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Proveedor</th>
                <th>Garantía</th>
                <th>Peso</th>
                <th>Fecha Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {piezas.map(pieza => (
                <PiezaRow key={pieza.id_pieza} pieza={pieza} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="search-section">
          <h3>Buscar Pieza</h3>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              className="search-input"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingrese ID de la pieza"
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
          {searchResult && <PiezaDetails pieza={searchResult} title="Resultado de la búsqueda:" />}
        </div>

        <AdvancedSearchForm />

        {advancedResults.length > 0 && (
          <div className="search-results">
            <h3>Resultados de Búsqueda Avanzada ({advancedResults.length})</h3>
            <table className="piezas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Modelo Compatible</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Proveedor</th>
                  <th>Garantía</th>
                  <th>Peso</th>
                  <th>Fecha Ingreso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {advancedResults.map(pieza => (
                  <tr key={pieza.id_pieza}>
                    <td>{pieza.id_pieza}</td>
                    <td>{pieza.nombre}</td>
                    <td>{pieza.categoria}</td>
                    <td>{pieza.marca}</td>
                    <td>{pieza.modelo_compatible}</td>
                    <td>${pieza.precio}</td>
                    <td>{pieza.stock}</td>
                    <td>{pieza.proveedor}</td>
                    <td>{pieza.garantia}</td>
                    <td>{pieza.peso} kg</td>
                    <td>{formatDate(pieza.fecha_ingreso)}</td>
                    <td>
                      <button 
                        onClick={() => {
                          setFormData(pieza);
                          setIsEditing(true);
                        }}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeletePieza(pieza.id_pieza)}
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
          <PiezaForm
            onSubmit={handleEditPieza}
            onCancel={() => {
              setIsEditing(false);
              setFormData(initialPiezaState);
            }}
            title="Editar Pieza"
          />
        ) : showCreateForm ? (
          <PiezaForm
            onSubmit={handleCreatePieza}
            onCancel={() => {
              setShowCreateForm(false);
              setFormData(initialPiezaState);
            }}
            title="Crear Nueva Pieza"
          />
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Agregar Nueva Pieza
          </button>
        )}
      </div>
    </div>
  );
};

export default PiezasPage;