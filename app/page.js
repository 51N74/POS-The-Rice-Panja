// src/app/page.js (Redesigned Layout)

"use client";

import React, { useState } from "react";
import OrderForm from "../components/OrderForm";
import Tables from "../components/TableSelection";
import RoomSelection from "../components/RoomSelection";

const Home = () => {
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // Logic สำหรับการเลือก/ยกเลิก (Unselect/Toggle)
  const handleTableSelect = (tableId) => {
    if (selectedTableId === tableId) {
      setSelectedTableId(null);
    } else {
      setSelectedTableId(tableId);
      setSelectedRoomId(null); // ยกเลิกการเลือกห้องเมื่อเลือกโต๊ะ
    }
  };

  const handleRoomSelect = (roomId) => {
    if (selectedRoomId === roomId) {
      setSelectedRoomId(null);
    } else {
      setSelectedRoomId(roomId);
      setSelectedTableId(null); // ยกเลิกการเลือกโต๊ะเมื่อเลือกห้อง
    }
  };

  const handleOrderSubmit = (order) => {
    console.log("Order submitted:", order);
    alert(
      `Order for ${selectedTableId ? "Table " + selectedTableId : "Room " + selectedRoomId} submitted successfully!`,
    );
    // 💡 หลังสั่งเสร็จ: ยกเลิกการเลือกโต๊ะ/ห้องทันที
    setSelectedTableId(null);
    setSelectedRoomId(null);
  };

  // Props ที่จะส่งให้ OrderForm
  const orderFormProps = selectedTableId
    ? { tableId: selectedTableId }
    : selectedRoomId
      ? { roomId: selectedRoomId }
      : {};

  // สถานะ: มีการเลือกโต๊ะหรือห้องหรือไม่
  const isItemSelected = selectedTableId || selectedRoomId;

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-green-600 mb-6">
        ร้านอาหารสวนปัญจะ 🍜
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* --- 1. SELECTION SIDE (Left Column) --- */}
        {/* คอลัมน์นี้จะหดลงเมื่อมีการเลือกแล้ว */}
        <div
          className={`
                        p-4 bg-white rounded-lg shadow-xl transition-all duration-300
                        ${isItemSelected ? "md:w-1/3 lg:w-1/4" : "md:w-full"}
                    `}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {isItemSelected ? "📍 เลือกใหม่" : "ขั้นตอนที่ 1: เลือกโต๊ะ/ห้อง"}
          </h2>

          {/* Grid สำหรับ Table และ Room Selection (ในคอลัมน์ซ้าย) */}
          <div
            className={`grid gap-4 ${isItemSelected ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
          >
            {/* Table selection */}
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                เลือกโต๊ะ
              </h3>
              <Tables
                onTableSelect={handleTableSelect}
                selectedTableId={selectedTableId}
              />
            </div>

            {/* Room selection */}
            <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100">
              <h3 className="text-lg font-semibold mb-2 text-purple-700">
                เลือกห้อง (Room)
              </h3>
              <RoomSelection
                onRoomSelect={handleRoomSelect}
                selectedRoomId={selectedRoomId}
              />
            </div>
          </div>
        </div>

        {/* --- 2. ORDER SIDE (Right Column) --- */}
        {/* คอลัมน์นี้จะขยายขึ้นเมื่อมีการเลือกแล้ว */}
        <div
          className={`
                        p-4 bg-white rounded-lg shadow-xl transition-all duration-300
                        ${isItemSelected ? "md:w-2/3 lg:w-3/4" : "md:hidden"}
                    `}
        >
          <h2 className="text-2xl font-bold mb-4 text-orange-700">
            รายการอาหาร (Order)
            <span className="text-lg font-medium ml-3 text-gray-600">
              {isItemSelected
                ? `สำหรับ ${selectedTableId ? "โต๊ะ " + selectedTableId : "ห้อง " + selectedRoomId}`
                : ""}
            </span>
          </h2>

          {isItemSelected ? (
            <OrderForm onOrderSubmit={handleOrderSubmit} {...orderFormProps} />
          ) : (
            <p className="text-center text-gray-500 py-10">
              กรุณาเลือก **โต๊ะ** หรือ **ห้อง** เพื่อเริ่มสั่งอาหาร
            </p>
          )}
        </div>

        {/* 💡 แสดงเฉพาะข้อความเริ่มต้นเมื่ออยู่บนมือถือและยังไม่มีการเลือก */}
        {!isItemSelected && (
          <div className="md:hidden w-full p-4 text-center text-gray-500 bg-white rounded-lg shadow-lg">
            <p>กรุณาเลือก **โต๊ะ** หรือ **ห้อง** เพื่อเริ่มสั่งอาหาร</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
