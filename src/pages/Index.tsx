import { useState } from 'react';
import { RoomSelector } from '@/components/RoomSelector';
import { Room } from '@/components/Room';
import { HelpMeOut } from '@/components/HelpMeOut';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LanguageSelector } from '@/components/LanguageSelector';
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
    return <Room roomId={selectedRoom} onBack={handleBackToRooms} />;
  }

  console.log('Rendering RoomSelector component');
  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t('app.title')}</h1>
        <div className="flex gap-2">
          <LanguageSelector />
          <ThemeSelector />
        </div>
      </div>
      <RoomSelector onSelectRoom={handleSelectRoom} />
      <HelpMeOut />
    </div>
  );
};

export default Index;