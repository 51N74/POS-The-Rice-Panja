"use client";

import React, { useEffect, useState } from "react";
// สมมติว่ามีการ import Component ของปุ่มโต๊ะมาที่นี่

const TableSelection = ({ onTableSelect }) => {
  const [tables, setTables] = useState(null); // 💡 เปลี่ยนจาก [] เป็น null หรือใช้ []
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        // 💡 ตรวจสอบพาธ API ให้ถูกต้อง: /api/tables (หรือ /api/table)
        const response = await fetch("/api/tables");

        if (!response.ok) {
          // หาก API ตอบกลับด้วยสถานะ 500 หรือ 404
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tables data.");
        }

        const data = await response.json();

        // 💡 การแก้ไขที่สำคัญ: ตรวจสอบว่าข้อมูลที่ได้มาเป็น Array หรือไม่
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          // ถ้า API ส่ง Object กลับมา ให้ตั้งค่า Error เพื่อหยุดการ Render
          setError("Invalid data format received from server.");
          setTables([]); // ตั้งค่าเป็น Array ว่าง เพื่อป้องกัน Error ในการ Render
          return;
        }

        setTables(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        // เนื่องจากเรามี 500 Error บ่อยครั้ง การจัดการ Error ใน UI จึงสำคัญ
        setError(
          err.message || "Could not load tables. Please check API status.",
        );
        setTables([]); // ต้องตั้งค่าเป็น Array ว่างเมื่อเกิด Error
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // --- การจัดการสถานะ Loading และ Error ---

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading tables...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  // 💡 การแก้ไขที่ 2: เพิ่มการตรวจสอบ Array ว่าง
  if (!tables || tables.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No tables available.</div>
    );
  }

  // --- Rendering Tables ---

  return (
    <div>
      <h1 className="text-2xl text-black font-semibold mb-6">เลือกโต๊ะ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {/* ✅ ตอนนี้มั่นใจแล้วว่า tables เป็น Array และมีข้อมูล */}
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onTableSelect(table.id)}
            className={`p-4 rounded-lg shadow-md transition-all
                        ${table.status === "Occupied" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
          >
            Table {table.id} ({table.status})
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableSelection;
