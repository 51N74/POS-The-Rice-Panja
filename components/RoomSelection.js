'use client';
import { useState, useEffect } from 'react';

const RoomSelection = ({ onRoomSelect }) => {
  const [room, setRoom] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch the room from the API
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        setRoom(data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };
    fetchRoom();
  }, []);

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    onRoomSelect(roomId); // Call the parent function to proceed with the order
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-black font-semibold mb-6">Select a Room</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {room.map((room) => (
          <div
            key={room.id}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all 
              ${room.status === 'Occupied' ? 'bg-red-100 border-red-400 text-red-600 cursor-not-allowed' : 'bg-white border-gray-300'}
              ${selectedRoom === room.id ? 'bg-green-100 border-green-400' : ''}`}
            onClick={() => handleRoomSelect(room.id)}
            disabled={room.status === 'Occupied'}
          >
            <span className='text-lg font-semibold mb-2 text-center text-black'>Room {room.roomNumber}</span>
            {/* {room.status === 'Occupied' && <span>(Occupied)</span>} */}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default RoomSelection
;
