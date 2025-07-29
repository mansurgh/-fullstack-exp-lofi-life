import { useParams, useNavigate } from 'react-router-dom';
import { RoomSelector } from '@/components/RoomSelector';
import { Room } from '@/components/Room';
import { HelpMeOut } from '@/components/HelpMeOut';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import { RecitationControls } from '@/components/RecitationControls';
import { useTranslation } from '@/contexts/TranslationContext';

const Index = () => {
  const { t } = useTranslation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleSelectRoom = (roomId: string) => {
    console.log('Selecting room:', roomId);
    navigate(`/room/${roomId}`);
  };

  const handleBackToRooms = () => {
    navigate('/');
  };

  console.log('Current roomId from URL:', roomId);
  console.log('Should show Room component:', !!roomId);

  if (roomId) {
    console.log('Rendering Room component with ID:', roomId);
    return (
      <>
        <Room roomId={roomId} onBack={handleBackToRooms} />
        
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