// src/pages/Dashboard.js
'use client';
import React, { useState, useEffect } from 'react';
import OrderStats from '@/components/OrderStats';
import ManageOrders from '@/components/ManageOrders';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(0);

    // Fetch orders when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch('/api/order');
            const data = await response.json();
            setOrders(data);
        };
        fetchOrders();
    }, []);

    const handleDeleteOrder = (orderId) => {
        setOrders(orders.filter((order) => order.id !== orderId));
        setRefresh(prev => prev + 1);
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map((order) => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setRefresh(prev => prev + 1);
    };

    // Calculate stats based on current orders
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const paidOrders = orders.filter(order => order.status === 'paid').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
            <div className="flex flex-col md:flex-row md:space-x-4">
                <OrderStats 
                    totalOrders={totalOrders} 
                    pendingOrders={pendingOrders} 
                    paidOrders={paidOrders} 
                    completedOrders={completedOrders} 
                    refresh={refresh} 
                />
            </div>
            <ManageOrders 
                orders={orders} 
                onDelete={handleDeleteOrder} 
                onStatusChange={handleStatusChange} 
                refresh={refresh} 
            />
        </div>
    );
};

export default Dashboard;
