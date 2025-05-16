import React from 'react';

const AdvancedSearch = ({
  title,
  fields,
  searchValues,
  onSearchChange,
  onSearch,
  onClear,
  error
}) => {
  return (
    <div className="advanced-search">
      <h3 className="search-title">{title}</h3>
      <form onSubmit={onSearch}>
        {fields.map((field, index) => (
          <div key={index} className="search-pair">
            <select
              name={`campo${index + 1}`}
              value={searchValues[`campo${index + 1}`]}
              onChange={onSearchChange}
              className="search-select"
            >
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              name={`valor${index + 1}`}
              value={searchValues[`valor${index + 1}`]}
              onChange={onSearchChange}
              placeholder="Valor a buscar"
              className="search-input"
            />
          </div>
        ))}
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            Buscar
          </button>
          <button
            type="button"
            onClick={onClear}
            className="btn-secondary"
          >
            Limpiar
          </button>
        </div>
      </form>
      {error && <p className="error-message mt-4">{error}</p>}
    </div>
  );
};

export default AdvancedSearch;