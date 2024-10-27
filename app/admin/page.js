'use client';

import React, { useState } from 'react';
import OrderForm from '../../components/OrderForm';
import Tables from '../../components/TableSelection';
import RoomSelection from '../../components/RoomSelection';
import Zone from '../../components/Zone';

const Home = () => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null); // Store selected table ID
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  

  const handleTableSelect = (tableId) => {
    setSelectedTableId(tableId); // Save the selected table ID
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId); // Save the selected room ID
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
    <h1 className="text-4xl sm:text-5xl font-bold text-center text-green-600 mb-6">
      ร้านอาหารสวนปัญจะ
    </h1>
    <h2 className="text-4xl sm:text-5xl font-bold text-center text-green-600 mb-6">Admin Page</h2>
  
    <div className="flex flex-col items-center">

    <div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Table selection (left side) */}
    <div>
      <Tables onTableSelect={handleTableSelect} />
    </div>

    {/* Room selection (right side) */}
    <div>
      <RoomSelection onRoomSelect={handleRoomSelect} />
    </div>
  </div>
</div>

      {/* Table selection with onTableSelect handler
      <Tables onTableSelect={handleTableSelect} />

      {/* Room selection with onRoomSelect handler */} 
     {/* <RoomSelection onRoomSelect={handleTableSelect} />  */}
    
   
      {/* Show OrderForm only if a table is selected */}
      {selectedTableId && (
        <OrderForm
          onOrderSubmit={handleOrderSubmit}
          tableId={selectedTableId}
        />
      )}

{selectedRoomId && (
        <OrderForm
          onOrderSubmit={handleOrderSubmit}
          roomId={selectedRoomId} // Pass the selected table ID to the OrderForm
        />
      )}
    </div>
  
    <footer className="mt-8 text-center">
      <p className="text-sm text-gray-500">
        © 2024 ร้านอาหารสวนปัญจะ. All rights reserved.
      </p>
    </footer>
  </div>
  
  );
};

export default Home;
