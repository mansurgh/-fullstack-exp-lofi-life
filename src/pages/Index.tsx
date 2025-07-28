import { useState } from 'react';
import { RoomSelector } from '@/components/RoomSelector';
import { Room } from '@/components/Room';

const Index = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
  };

  if (selectedRoom) {
    return <Room roomId={selectedRoom} onBack={handleBackToRooms} />;
  }

  return <RoomSelector onSelectRoom={handleSelectRoom} />;
};

export default Index;
