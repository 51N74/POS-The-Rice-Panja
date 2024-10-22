// src/components/ManageOrders.js
import React, { useState, useEffect } from 'react';
import { PrinterIcon } from '@heroicons/react/outline'; // Importing Heroicons printer icon

const statusOrder = {
    pending: 0,
    paid: 1,
    completed: 2,
    canceled: 3,
};

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/order');
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
        }
    };

    const printReceipt = async (order) => {
        try {
          const response = await fetch('/api/print', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              ipAddress: '192.168.1.50', // Replace with actual IP address of the printer
              port: 9100, // Replace with actual port number
              orderDetails: order.items.map(item => `${item.menuItem.name} x ${item.quantity}`).join(', '),
              date: new Date().toLocaleDateString(),
              totalAmount: Number(order.total).toFixed(2),
            }),
          });
      
          if (response.ok) {
            const result = await response.json();
            console.log(result.message); // Receipt printed successfully
            alert('Receipt printed successfully');
          } else {
            const result = await response.json();
            alert(`Failed to print receipt: ${result.message}`);
          }
        } catch (error) {
          console.error('Error printing receipt:', error);
          alert('Failed to print receipt. Please try again.');
        }
      };
      
      const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // const sortedOrders = orders.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    if (loading) return <div className="text-center py-8">Loading orders...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-lg shadow-lg border border-orange-400">
            <h2 className="text-4xl font-bold mb-6 text-orange-600 text-center">Manage Orders</h2>
            {sortedOrders.length === 0 ? (
                <p className="text-center text-gray-600">No orders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-orange-300">
                            <tr>
                                <th className="border px-4 py-2 text-left font-semibold text-lg">Order ID</th>
                                <th className="border px-4 py-2 text-left font-semibold text-lg">Table Number</th>
                                <th className="border px-4 py-2 text-left font-semibold text-lg">Items</th>
                                <th className="border px-4 py-2 text-left font-semibold text-lg">Total</th>
                                <th className="border px-4 py-2 text-left font-semibold text-lg">Status</th>
                                <th className="border px-4 py-2 text-left font-semibold text-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.map(order => (
                                <tr
                                    key={order.id}
                                    className={`hover:bg-yellow-100 transition duration-200 ${
                                        order.status === 'canceled' ? 'bg-red-200' : ''
                                    }`}
                                >
                                    <td className="text-black border px-4 py-2 font-medium">{order.id}</td>
                                    <td className="text-black border px-4 py-2 font-medium">{order.tableId}</td>
                                    <td className="border px-4 py-2">
                                        {order.items.map(item => (
                                            <div key={item.id} className="text-black">
                                                {item.menuItem.name} x {item.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="border px-4 py-2 font-semibold text-orange-500">
                                        ${Number(order.total).toFixed(2)}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className="px-3 py-1 border rounded-lg bg-yellow-50 text-gray-700 transition duration-200 hover:bg-orange-200"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="completed">Completed</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                    </td>
                                    <td className="border px-4 py-2 flex space-x-2">
                                        <button
                                            onClick={() => printReceipt(order)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center"
                                        >
                                            <PrinterIcon className="h-5 w-5 mr-1" />
                                            Print Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
