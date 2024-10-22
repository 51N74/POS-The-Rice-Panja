// src/components/RecentOrders.js

import React from 'react';

const RecentOrders = ({ orders }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-100 transition duration-150">
              <td className="py-2 px-4 text-sm font-medium text-gray-900">{order.id}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{order.items}</td>
              <td className="py-2 px-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
              <td className="py-2 px-4 text-sm">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
