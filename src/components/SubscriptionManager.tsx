import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, CreditCard, RefreshCw } from 'lucide-react';

export const SubscriptionManager = () => {
  const { 
    user, 
    isSubscribed, 
    subscriptionTier, 
    subscriptionEnd, 
    checkSubscription,
    createCheckout,
    openCustomerPortal 
  } = useAuth();

  if (!user) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Subscription Status</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkSubscription}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {isSubscribed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">
                {subscriptionTier} Subscriber
              </Badge>
            </div>
            {subscriptionEnd && (
              <p className="text-sm text-muted-foreground">
                Renews on: {formatDate(subscriptionEnd)}
              </p>
            )}
            <p className="text-sm text-green-600">
              ✓ Premium transcription features unlocked
            </p>
            <Button
              onClick={openCustomerPortal}
              variant="outline"
              className="w-full"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Badge variant="secondary">Free Plan</Badge>
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium for audio transcription features
            </p>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">Premium Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Audio transcription with OpenAI Whisper</li>
                <li>• Multiple language support</li>
                <li>• Download transcriptions</li>
                <li>• Save audio files to cloud storage</li>
              </ul>
            </div>
            <Button
              onClick={createCheckout}
              className="w-full"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium - €9.99/month
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};