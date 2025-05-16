import React from 'react';

const SearchSection = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  onSearch, 
  onClear, 
  placeholder,
  error,
  children 
}) => {
  return (
    <div className="search-section">
      <h3 className="search-title">{title}</h3>
      <form onSubmit={onSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          value={searchValue}
          onChange={onSearchChange}
          placeholder={placeholder}
        />
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
      {children}
    </div>
  );
};

export default SearchSection;