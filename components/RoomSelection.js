"use client";
import { useState, useEffect } from "react";

const RoomSelection = ({ onRoomSelect }) => {
  // 💡 ปรับปรุง State: เพิ่ม loading และ error
  const [rooms, setRooms] = useState(null); // ใช้ null เพื่อรอ Fetch ครั้งแรก
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch the rooms from the API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch room data.");
        }

        const data = await response.json();

        // 🔑 การป้องกัน TypeError: ตรวจสอบว่าข้อมูลที่ได้มาเป็น Array
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          setError("Invalid data format received from server.");
          setRooms([]); // ตั้งค่าเป็น Array ว่าง
          return;
        }

        setRooms(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(
          err.message || "Could not load rooms. Please check API status.",
        );
        setRooms([]); // ต้องตั้งค่าเป็น Array ว่างเมื่อเกิด Error
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomSelect = (roomId, status) => {
    // 🔑 ป้องกันการเลือกห้องที่ไม่ว่าง
    if (status === "Occupied") return;

    setSelectedRoom(roomId);
    onRoomSelect(roomId); // Call the parent function
  };

  // --- การจัดการสถานะ Loading และ Error ---

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">กำลังโหลดห้องว่าง...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  // 💡 การแสดงผลเมื่อไม่มีห้องว่าง (หรือถ้า Fetch แล้วได้ Array ว่าง)
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ไม่พบข้อมูลห้องว่าง กรุณาตรวจสอบฐานข้อมูล
      </div>
    );
  }

  // --- Rendering Rooms ---
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-black font-semibold mb-6">เลือกห้อง</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {rooms.map((room) => (
          <div
            key={room.id}
            // 🔑 ใช้ Logic ในการตรวจสอบสถานะและป้องกันการคลิก
            onClick={() => handleRoomSelect(room.id, room.status)}
            className={`
                            flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all
                            ${
                              room.status === "Occupied"
                                ? "bg-red-100 border-red-400 text-red-600 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                            }
                            ${selectedRoom === room.id ? "ring-4 ring-offset-2 ring-green-700" : ""}
                        `}
          >
            <span className="text-lg font-semibold mb-2 text-center">
              ห้องที่ {room.roomNumber}
            </span>
            <span className="text-sm font-light">
              {room.status === "Occupied" ? "ไม่ว่าง" : "ว่าง"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSelection;
