import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { RoomSelector } from '@/components/RoomSelector';
import { Room } from '@/components/Room';
import { HelpMeOut } from '@/components/HelpMeOut';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import { RecitationControls } from '@/components/RecitationControls';
import { TranscriptionPipeline } from '@/components/TranscriptionPipeline';
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
    <div className="min-h-screen p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Theme selector - hidden on mobile, shown on larger screens */}
      <div className="hidden sm:flex justify-end items-center mb-4">
        <ThemeSelector />
      </div>
      
      <RoomSelector onSelectRoom={handleSelectRoom} />
      
      {/* Transcription Pipeline */}
      <TranscriptionPipeline />
      
      {/* HelpMeOut - hidden on mobile to reduce clutter */}
      <div className="hidden sm:block">
        <HelpMeOut />
      </div>
      
      {/* Persistent Recitation Controls - mobile friendly */}
      <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50">
        <RecitationControls />
      </div>
    </div>
  );
};

export default Index;