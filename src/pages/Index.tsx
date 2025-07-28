import { useState } from 'react';
import { RoomSelector } from '@/components/RoomSelector';
import { Room } from '@/components/Room';
import { HelpMeOut } from '@/components/HelpMeOut';
import { ThemeSelector } from '@/components/ThemeSelector';

const Index = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleSelectRoom = (roomId: string) => {
    console.log('Selecting room:', roomId);
    setSelectedRoom(roomId);
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
  };

  console.log('Current selectedRoom state:', selectedRoom);
  console.log('Should show Room component:', !!selectedRoom);

  if (selectedRoom) {
    console.log('Rendering Room component with ID:', selectedRoom);
    return <Room roomId={selectedRoom} onBack={handleBackToRooms} />;
  }

  console.log('Rendering RoomSelector component');
  return (
    <div className="space-y-8">
      <ThemeSelector />
      <RoomSelector onSelectRoom={handleSelectRoom} />
      <HelpMeOut />
    </div>
  );
};

export default Index;
