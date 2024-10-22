// src/components/OrderStats.js

import React, { useState, useEffect } from 'react';

const OrderStats = ({ refresh }) => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pending: 0,
        paid: 0,
        completed: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch order statistics
    const fetchOrderStats = async () => {
        try {
            const response = await fetch('/api/order');
            if (!response.ok) {
                throw new Error('Failed to fetch order statistics');
            }
            const orders = await response.json();

            // Calculate statistics
            const totalOrders = orders.length;
            const pending = orders.filter(order => order.status === 'pending').length;
            const paid = orders.filter(order => order.status === 'paid').length;
            const completed = orders.filter(order => order.status === 'completed').length;

            setStats({
                totalOrders,
                pending,
                paid,
                completed,
            });
        } catch (error) {
            console.error('Error fetching order statistics:', error);
            setError('Failed to load order statistics. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderStats();
    }, [refresh]); // Fetch stats whenever `refresh` changes

    if (loading) return <div className="text-center py-8">Loading order statistics...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg shadow-lg border border-blue-400">
            <h2 className="text-3xl font-bold mb-4 text-blue-600 text-center">Order Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold text-blue-700">Total Orders</h3>
                    <p className="text-2xl font-bold text-orange-500">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold text-blue-700">Pending</h3>
                    <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold text-blue-700">Paid</h3>
                    <p className="text-2xl font-bold text-orange-500">{stats.paid}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold text-blue-700">Completed</h3>
                    <p className="text-2xl font-bold text-orange-500">{stats.completed}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderStats;
