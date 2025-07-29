import { useState } from 'react';
import { RoomSelector } from '@/components/RoomSelector';
import { Room } from '@/components/Room';
import { HelpMeOut } from '@/components/HelpMeOut';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import { RecitationControls } from '@/components/RecitationControls';
import { useTranslation } from '@/contexts/TranslationContext';

const Index = () => {
  const { t } = useTranslation();
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
    return (
      <>
        <Room roomId={selectedRoom} onBack={handleBackToRooms} />
        
        {/* Persistent Recitation Controls */}
        <div className="fixed bottom-4 right-4 z-50">
          <RecitationControls />
        </div>
      </>
    );
  }

  console.log('Rendering RoomSelector component');
  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="flex justify-end items-center mb-4">
        <ThemeSelector />
      </div>
      <RoomSelector onSelectRoom={handleSelectRoom} />
      <HelpMeOut />
      
      {/* Persistent Recitation Controls */}
      <div className="fixed bottom-4 right-4 z-50">
        <RecitationControls />
      </div>
    </div>
  );
};

export default Index;