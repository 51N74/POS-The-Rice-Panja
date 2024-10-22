// src/components/MenuOverview.js

import React from 'react';

const MenuOverview = () => {
  // Placeholder data, replace with actual data from your API or state
  const menuItems = [
    { id: 1, name: 'Pizza', price: 12.99 },
    { id: 2, name: 'Burger', price: 9.99 },
    { id: 3, name: 'Pasta', price: 11.99 },
  ];

  return (
    <div className="menu-overview bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Menu Overview</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="border-b py-2">
            <span>{item.name}</span>
            <span className="ml-4 font-bold">${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuOverview;
