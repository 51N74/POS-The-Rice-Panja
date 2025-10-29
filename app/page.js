// src/app/page.js

"use client";

import React, { useState } from "react";
// import PaymentForm from "../components/PaymentForm"; // 💡 ไม่ได้ใช้: ลบออก
import OrderForm from "../components/OrderForm";
import Tables from "../components/TableSelection";
import RoomSelection from "../components/RoomSelection";
// import Zone from "../components/Zone"; // 💡 ไม่ได้ใช้: ลบออก หรือเพิ่ม Logic การใช้

const Home = () => {
  // 💡 ลบ: currentOrder, showPayment, handlePaymentComplete ออก เนื่องจากไม่ได้ใช้แสดงผล
  // const [currentOrder, setCurrentOrder] = useState(null);
  // const [showPayment, setShowPayment] = useState(false);

  const [selectedTableId, setSelectedTableId] = useState(null); // Store selected table ID
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleTableSelect = (tableId) => {
    setSelectedTableId(tableId); // Save the selected table ID
    setSelectedRoomId(null); // Clear room selection
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId); // Save the selected room ID
    setSelectedTableId(null); // Clear table selection
  };

  const handleOrderSubmit = (order) => {
    console.log("Order submitted:", order);
    // 💡 หากต้องการให้มีขั้นตอน Payment ต่อ ให้เพิ่ม Logic ส่วนนี้
    // setCurrentOrder(order);
    // setShowPayment(true);
    alert(
      `Order for ${selectedTableId ? "Table " + selectedTableId : "Room " + selectedRoomId} submitted successfully!`,
    );

    // 💡 หลังสั่งเสร็จ ถ้าต้องการให้หน้าจอกลับมาให้เลือกโต๊ะ/ห้องใหม่:
    // setSelectedTableId(null);
    // setSelectedRoomId(null);
  };

  // 💡 สร้าง Props สำหรับ OrderForm ที่ส่งไป
  const orderFormProps = selectedTableId
    ? { tableId: selectedTableId }
    : selectedRoomId
      ? { roomId: selectedRoomId }
      : {};

  return (
    <div className="container mx-auto px-6 py-10 bg-gray-100 rounded-lg shadow-lg min-h-screen">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-green-600 mb-8">
        ร้านอาหารสวนปัญจะ 🍜
      </h1>

      {/* --- */}

      <div className="flex flex-col items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Zone Component สามารถวางที่นี่ ถ้าต้องการให้เลือก Zone ก่อน */}
            {/* <div className="col-span-1">
                <Zone onZoneSelect={...} />
            </div> */}

            {/* Table selection */}
            <div className="col-span-1 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-700">
                เลือกโต๊ะ
              </h2>
              <Tables onTableSelect={handleTableSelect} />
            </div>

            {/* Room selection */}
            <div className="col-span-1 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-purple-700">
                เลือกห้อง (Room)
              </h2>
              <RoomSelection onRoomSelect={handleRoomSelect} />
            </div>

            {/* Order Form Column (ขยายพื้นที่) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-orange-700">
                รายการอาหาร
              </h2>
              {/* 💡 แสดง OrderForm ถ้ามีการเลือก โต๊ะ หรือ ห้อง */}
              {selectedTableId || selectedRoomId ? (
                <OrderForm
                  onOrderSubmit={handleOrderSubmit}
                  {...orderFormProps} // ส่ง props ที่เหมาะสม (tableId หรือ roomId)
                />
              ) : (
                <p className="text-center text-gray-500 py-10">
                  กรุณาเลือก **โต๊ะ** หรือ **ห้อง** เพื่อเริ่มสั่งอาหาร
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- */}

      <footer className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          © 2024 ร้านอาหารสวนปัญจะ. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
