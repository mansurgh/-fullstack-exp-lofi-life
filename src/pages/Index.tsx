import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { RoomSelector } from '@/components/RoomSelector';
import { Room } from '@/components/Room';
import { HelpMeOut } from '@/components/HelpMeOut';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import { RecitationControls } from '@/components/RecitationControls';
import { TranscriptionPipeline } from '@/components/TranscriptionPipeline';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const Index = () => {
  const { user, isSubscribed, signOut } = useAuth();
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

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  console.log('Current roomId from URL:', roomId);
  console.log('Should show Room component:', !!roomId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with auth button */}
      <div className="flex justify-end p-4">
        <Button
          onClick={handleAuthAction}
          variant="outline"
          size="sm"
        >
          {user ? (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </Button>
      </div>

      {roomId ? (
        // Room view
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-center mb-6">
            <Button
              onClick={handleBackToRooms}
              variant="outline"
              className="mb-4"
            >
              ← Back to Rooms
            </Button>
          </div>
          <Room roomId={roomId} onBack={handleBackToRooms} />
          <RecitationControls />
        </div>
      ) : (
        // Main page
        <div className="container mx-auto px-4 py-8 space-y-6">
          <RoomSelector onSelectRoom={handleSelectRoom} />
          
          {/* Premium features - only show for subscribed users */}
          {user && isSubscribed && (
            <TranscriptionPipeline />
          )}
          
          {/* Subscription management - only show for logged in users */}
          {user && (
            <SubscriptionManager />
          )}
          
          <div className="hidden lg:block">
            <HelpMeOut />
          </div>
          <div className="hidden lg:block">
            <ThemeSelector />
          </div>
          <RecitationControls />
        </div>
      )}
    </div>
  );
};

export default Index;