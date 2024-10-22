// src/components/OrderTable.js

import React, { useState } from 'react';

const OrderTable = ({ orders, onDelete, onStatusChange }) => {
  const handleStatusChange = (orderId, newStatus) => {
    onStatusChange(orderId, newStatus);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-100 transition duration-150">
              <td className="py-2 px-4 text-sm font-medium text-gray-900">{order.id}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{order.customer}</td>
              <td className="py-2 px-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
              <td className="py-2 px-4 text-sm">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border border-gray-300 rounded-md py-1 px-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="py-2 px-4 text-sm">
                <button onClick={() => onDelete(order.id)} className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
