import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import Pagination from "./Pagination";
import PageInfo from './PageInfo'
import RowsPerPage from './RowsPerPage'
const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu");
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      const data = await response.json();
      setMenuItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">

  {/* Header Actions */}
  <div className="flex justify-between items-center mb-4">
    <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500">+ ADD ITEM</button>
    <div className="flex space-x-4">
      <a href="#" className="text-black hover:text-green-600">IMPORT</a>
      <a href="#" className="text-black hover:text-green-600">EXPORT</a>
    </div>
  </div>

  {/* Filters */}
  <div className="flex justify-between items-center mb-4">
    <div className="flex space-x-4">
      <Filter label="Category" options={['All Items', 'อาหาร']} />
      <Filter label="Stock alert" options={['All Items']} />
    </div>
    <button className="text-gray-600 hover:text-black">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m4 0a4 4 0 11-8 0 4 4 0 018 0zm0 0h.01M15 12v.01" />
      </svg>
    </button>
  </div>

  {/* Item Table */}
  <table className="min-w-full bg-white">
    <thead>
      <tr className="bg-gray-50 text-black">
        {['', 'Item name','Category', 'Price'].map((header, index) => (
          <th key={index} className="py-2 px-4 border-b">{header}</th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200 text-black">
      {menuItems.map((item, index) => (
        <tr key={index}>
          <td className="py-2 px-4 border-b">
            <input type="checkbox" />
          </td>
          <td className="py-2 px-4 border-b">{item.name}</td>
          {/* <td className="py-2 px-4 border-b">{item.description}</td> */}
          <td className="py-2 px-4 border-b">{item.category}</td>
          <td className="py-2 px-4 border-b">{item.price}</td>         
        </tr>
      ))}
    </tbody>
  </table>

  {/* Pagination */}
  <div className="flex justify-between items-center mt-4">
    <Pagination />
    <PageInfo currentPage={1} totalPages={1} />
    <RowsPerPage options={[10]} />
  </div>
  
</div>

  );
};

export default MenuList;
