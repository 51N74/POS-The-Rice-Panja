'use client';
import { useState, useEffect } from 'react';

const TableSelection = ({ onTableSelect }) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  // Fetch the tables from the API
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/api/tables');
        const data = await response.json();
        setTables(data);
      } catch (error) {
        console.error('Failed to fetch tables:', error);
      }
    };
    fetchTables();
  }, []);

  const handleTableSelect = (tableId) => {
    setSelectedTable(tableId);
    onTableSelect(tableId); // Call the parent function to proceed with the order
  };

  return (
    <div className="table-selection-container">
      <h1>Select a Table</h1>
      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-item ${table.status === 'Occupied' ? 'occupied' : ''} ${
              selectedTable === table.id ? 'selected' : ''
            }`}
            onClick={() => handleTableSelect(table.id)}
            disabled={table.status === 'Occupied'}
          >
            <span>Table {table.tableNumber}</span>
            {table.status === 'Occupied' && <span>(Occupied)</span>}
          </div>
        ))}
      </div>
      {selectedTable && <button onClick={() => alert(`Proceeding with table ${selectedTable}`)}>Proceed</button>}
      <style jsx>{`
        .table-selection-container {
          text-align: center;
        }
        .table-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 20px;
        }
        .table-item {
         color:red;
          padding: 20px;
          border: 2px solid #ccc;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .table-item.occupied {
          background-color: #f8d7da;
          cursor: not-allowed;
        }
        .table-item.selected {
          background-color: #d4edda;
        }
      `}</style>
    </div>
  );
};

export default TableSelection;
