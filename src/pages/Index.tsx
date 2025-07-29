import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const handleSelectRoom = (roomId: string) => {
    console.log('Selecting room:', roomId);
    // Preserve current search params when navigating to room
    const currentSearch = location.search;
    navigate(`/room/${roomId}${currentSearch}`);
  };

  const handleBackToRooms = () => {
    // Extract search params from current URL to restore them
    const urlParams = new URLSearchParams(location.search);
    const page = urlParams.get('page');
    const filter = urlParams.get('filter');
    
    let backUrl = '/';
    const params = new URLSearchParams();
    if (page) params.set('page', page);
    if (filter) params.set('filter', filter);
    
    if (params.toString()) {
      backUrl += `?${params.toString()}`;
    }
    
    navigate(backUrl);
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