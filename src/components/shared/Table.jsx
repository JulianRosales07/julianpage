import React from 'react';

const Table = ({ headers, children }) => {
  return (
    <div className="table-container">
      <table className="table-base">
        <thead className="table-header">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="table-header-cell">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;