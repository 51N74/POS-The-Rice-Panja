'use client';

import React, { useState } from 'react';
import OrderForm from '../../components/OrderForm';
import PaymentForm from '../../components/PaymentForm';
import Tables from '../../components/TableSelection';

const Home = () => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null); // Store selected table ID
  

  const handleTableSelect = (tableId) => {
    setSelectedTableId(tableId); // Save the selected table ID
  };

  const handleOrderSubmit = (order) => {
    console.log("Order submitted:", order);
    setCurrentOrder(order);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    setCurrentOrder(null);
    setShowPayment(false);
    setSelectedTableId(null); // Reset table selection after payment
  };

  return (
    <div className="container mx-auto px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-5xl font-bold text-center text-green-600 mb-6">ร้านอาหารสวนปัญจะ</h1>
      <h2 className="text-5xl font-bold text-center text-green-600 mb-6">Admin Page</h2>
      <div className="flex flex-col items-center">
        {/* Table selection with onTableSelect handler */}
        <Tables onTableSelect={handleTableSelect} />

        {/* Show OrderForm only if a table is selected */}
        {selectedTableId && (
          <OrderForm 
            onOrderSubmit={handleOrderSubmit} 
            tableId={selectedTableId} // Pass the selected table ID to the OrderForm
          />
        )}

      </div>
      
      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-500">© 2024 ร้านอาหารสวนปัญจะ. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
