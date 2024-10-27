'use client';

import React, { useState } from 'react';
import OrderForm from '../components/OrderForm';
import PaymentForm from '../components/PaymentForm';
import Tables from '../components/TableSelection';
import RoomSelection from '../components/RoomSelection';

const Zone = () => {
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
  return (
    <div className="container mx-auto px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Table selection (left side) */}
  <div className="order-1 md:order-1">
    <Tables onTableSelect={handleTableSelect} />
  </div>

  {/* Room selection (right side) */}
  <div className="order-2 md:order-2">
    <RoomSelection onRoomSelect={handleRoomSelect} />
  </div>
</div>



  
  </div>
  
  );
};

export default Zone;
