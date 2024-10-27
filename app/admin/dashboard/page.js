// // src/pages/Dashboard.js
// 'use client';
// import React, { useState, useEffect } from 'react';
// import OrderStats from '../../../components/OrderStats';
// import ManageOrders from '../../../components/ManageOrders';

// const Dashboard = () => {
//     const [orders, setOrders] = useState([]);
//     const [refresh, setRefresh] = useState(0);

//     // Fetch orders when the component mounts
//     useEffect(() => {
//         const fetchOrders = async () => {
//             const response = await fetch('/api/order');
//             const data = await response.json();
//             setOrders(data);
//         };
//         fetchOrders();
//     }, []);

//     const handleDeleteOrder = (orderId) => {
//         setOrders(orders.filter((order) => order.id !== orderId));
//         setRefresh(prev => prev + 1);
//     };

//     const handleStatusChange = (orderId, newStatus) => {
//         setOrders(orders.map((order) => 
//             order.id === orderId ? { ...order, status: newStatus } : order
//         ));
//         setRefresh(prev => prev + 1);
//     };

//     // Calculate stats based on current orders
//     const totalOrders = orders.length;
//     const pendingOrders = orders.filter(order => order.status === 'pending').length;
//     const paidOrders = orders.filter(order => order.status === 'paid').length;
//     const completedOrders = orders.filter(order => order.status === 'completed').length;

//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
//             <div className="flex flex-col md:flex-row md:space-x-4">
//                 <OrderStats 
//                     totalOrders={totalOrders} 
//                     pendingOrders={pendingOrders} 
//                     paidOrders={paidOrders} 
//                     completedOrders={completedOrders} 
//                     refresh={refresh} 
//                 />
//             </div>
//             <ManageOrders 
//                 orders={orders} 
//                 onDelete={handleDeleteOrder} 
//                 onStatusChange={handleStatusChange} 
//                 refresh={refresh} 
//             />
//         </div>
//     );
// };

// export default Dashboard;



// pages/index.js
'use client';
import { useState } from 'react';
import { HomeIcon, ChartBarIcon, ArchiveIcon } from '@heroicons/react/outline';
import AddItems from '../../../components/AddItems';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('reports');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-600 text-white flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-green-700">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <nav className="flex-1 mt-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveMenu('account')}
                className={`flex items-center px-4 py-2 w-full transition ${
                  activeMenu === 'account'
                    ? 'bg-green-700'
                    : 'hover:bg-green-500'
                }`}
              >
                <HomeIcon className="h-6 w-6 mr-2" />
                Account
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('reports')}
                className={`flex items-center px-4 py-2 w-full transition ${
                  activeMenu === 'reports'
                    ? 'bg-green-700'
                    : 'hover:bg-green-500'
                }`}
              >
                <ChartBarIcon className="h-6 w-6 mr-2" />
                Reports
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('items')}
                className={`flex items-center px-4 py-2 w-full transition ${
                  activeMenu === 'items' ? 'bg-green-700' : 'hover:bg-green-500'
                }`}
              >
                <ArchiveIcon className="h-6 w-6 mr-2" />
                Items
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {activeMenu === 'reports' && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800">
              Sales Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Sales</h3>
                <p className="text-2xl font-bold text-green-600">฿190.00</p>
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Refunds</h3>
                <p className="text-2xl font-bold text-red-500">฿0.00</p>
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Discount</h3>
                <p className="text-2xl font-bold text-blue-500">฿0.00</p>
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Total Profit</h3>
                <p className="text-2xl font-bold text-green-600">฿190.00</p>
              </div>
            </div>

            {/* Sales graph */}
            <div className="bg-white mt-6 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-700">
                Sales Trend
              </h3>
              <div className="mt-4">
                {/* Placeholder for graph */}
                <div className="h-64 bg-gray-200 rounded-lg">
                  <p className="text-center text-gray-600 mt-24">
                    Graph will go here
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeMenu === 'account' && <p>Account details here...</p>}
        {activeMenu === 'items' && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800">
            Items
            </h2>
            <AddItems />

            
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
