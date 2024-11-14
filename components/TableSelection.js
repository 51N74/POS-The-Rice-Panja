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
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-black font-semibold mb-6">เลือกโต๊ะ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all 
              ${table.status === 'Occupied' ? 'bg-red-100 border-red-400 text-red-600 cursor-not-allowed' : 'text-black bg-white border-gray-300'}
              ${selectedTable === table.id ? 'bg-green-100 border-green-400 text-black' : ''}`}
            onClick={() => handleTableSelect(table.id)}
            disabled={table.status === 'Occupied'}
          >
            <span>โต๊ะที่ {table.tableNumber}</span>
            {/* {table.status === 'Occupied' && <span>(Occupied)</span>} */}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default TableSelection;
