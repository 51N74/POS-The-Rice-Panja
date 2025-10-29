"use client";
import { useState, useEffect } from "react";
import React from "react"; // 💡 ต้อง import React สำหรับ Functional Component

const TableSelection = ({ onTableSelect }) => {
  // 💡 ปรับปรุง State: ใช้ null สำหรับรอ Fetch และเพิ่ม loading/error state
  const [tables, setTables] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  // Fetch the tables from the API
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("/api/tables");

        if (!response.ok) {
          // หาก API ตอบกลับด้วยสถานะ 500 หรือ 404 (ซึ่งเกิดขึ้นบ่อยครั้งในการเรียกครั้งแรก)
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tables data.");
        }

        const data = await response.json();

        // 🔑 การป้องกัน Type Error: ตรวจสอบว่าข้อมูลที่ได้มาเป็น Array หรือไม่
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          setError("Invalid data format received from server.");
          setTables([]); // ตั้งค่าเป็น Array ว่าง
          return;
        }

        setTables(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        // 💡 การจัดการ Error ที่ดีขึ้น
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

  const handleTableSelect = (tableId, status) => {
    // 🔑 ป้องกันการเลือกโต๊ะที่ไม่ว่าง (แม้ว่า CSS จะทำให้คลิกไม่ได้)
    if (status === "Occupied") return;

    setSelectedTable(tableId);
    onTableSelect(tableId); // Call the parent function to proceed with the order
  };

  // --- การจัดการสถานะ Loading และ Error ---

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        กำลังโหลดข้อมูลโต๊ะ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        ⚠️ Error: {error}
        <p className="text-sm text-gray-500 mt-2">
          กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูลและรีสตาร์ทเซิร์ฟเวอร์
        </p>
      </div>
    );
  }

  // 💡 การแสดงผลเมื่อไม่มีโต๊ะว่าง (หรือถ้า Fetch แล้วได้ Array ว่าง)
  if (!tables || tables.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ไม่พบข้อมูลโต๊ะ กรุณารัน Seed file.
      </div>
    );
  }

  // --- Rendering Tables ---
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-black font-semibold mb-6">เลือกโต๊ะ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {tables.map((table) => (
          <div
            key={table.id}
            // 🔑 การเรียกใช้ function พร้อมส่ง status เพื่อใช้ใน Logic การป้องกัน
            onClick={() => handleTableSelect(table.id, table.status)}
            // 💡 ลบ disabled={...} ออกจาก div เนื่องจากไม่ได้รับการสนับสนุนใน HTML

            className={`
                            flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all
                            ${
                              table.status === "Occupied"
                                ? "bg-red-500 text-white cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                            }
                            ${selectedTable === table.id ? "ring-4 ring-offset-2 ring-green-700" : ""}
                        `}
          >
            <span className="text-lg font-semibold mb-2">
              โต๊ะที่ {table.id}
            </span>
            <span className="text-sm font-light">
              {table.status === "Occupied" ? "ไม่ว่าง" : "ว่าง"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSelection;
