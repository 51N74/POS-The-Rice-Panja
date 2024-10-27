import { useState } from 'react';

const AddItems = () => {
  const [items, setItems] = useState([
    { name: 'TestItem', category: 'อาหาร', price: '฿95.00', cost: '฿0.00', margin: '100%', stock: -2, status: 'Out of stock' },
    // Add more items as needed
  ]);

  return (
    <div className="container mx-auto p-4">
      {/* Add Item and Menu Actions */}
      <div className="flex items-center justify-between mb-4">
        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500">+ ADD ITEM</button>
        <div className="flex space-x-4">
          <a href="#" className="text-black hover:text-green-600">IMPORT</a>
          <a href="#" className="text-black hover:text-green-600">EXPORT</a>
        </div>
      </div>
      
      {/* Filters for Category and Stock Alert */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-600 focus:ring-green-600">
              <option>All Items</option>
              <option>อาหาร</option>
              {/* Add more categories */}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock alert</label>
            <select className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-600 focus:ring-green-600">
              <option>All Items</option>
              {/* Add more stock alert options */}
            </select>
          </div>
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
          <tr>
            <th className="py-2 px-4 border-b">
              <input type="checkbox" />
            </th>
            <th className="py-2 px-4 border-b">Item name</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Cost</th>
            <th className="py-2 px-4 border-b">Margin</th>
            <th className="py-2 px-4 border-b">In stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">
                <input type="checkbox" />
              </td>
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">{item.category}</td>
              <td className="py-2 px-4 border-b">{item.price}</td>
              <td className="py-2 px-4 border-b">{item.cost}</td>
              <td className="py-2 px-4 border-b">{item.margin}</td>
              <td className={`py-2 px-4 border-b ${item.stock < 0 ? 'text-red-500' : 'text-black'}`}>
                {item.stock}
              </td>
              <td className={`py-2 px-4 border-b ${item.status === 'Out of stock' ? 'text-red-500' : 'text-green-500'}`}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-black">❮</button>
          <button className="p-2 text-gray-500 hover:text-black">❯</button>
        </div>
        <div>
          <p>Page 1 of 1</p>
        </div>
        <div>
          <label className="text-gray-700 mr-2">Rows per page:</label>
          <select className="border-gray-300 rounded-md shadow-sm focus:border-green-600 focus:ring-green-600">
            <option>10</option>
            {/* Add more page options */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AddItems;
