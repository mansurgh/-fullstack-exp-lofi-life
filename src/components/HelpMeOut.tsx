import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Mail, Phone, CreditCard } from 'lucide-react';

export const HelpMeOut = () => {
  const [donationAmount, setDonationAmount] = useState('');

  const handleDonation = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // For now, just show the bank details - we can implement Stripe later
    alert(`Thank you for wanting to donate €${donationAmount}! Please use bank details: BE86 0637 1216 5850`);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 sm:mt-8 px-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="flex items-center justify-center gap-2 text-foreground text-lg sm:text-xl">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Help Me Out
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Support this project and help me improve it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {/* Money Support */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="w-full text-sm sm:text-base py-2 sm:py-3">
                <CreditCard className="h-4 w-4 mr-2" />
                With Money
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Support with Donation</DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  Choose an amount to support the development of this project
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="text-sm font-medium text-foreground">
                    Amount (€)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="10.00"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="1"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Bank Details:
                  </p>
                  <p className="text-sm font-mono bg-muted p-2 rounded">
                    BE86 0637 1216 5850
                  </p>
                </div>
                <Button onClick={handleDonation} className="w-full">
                  Proceed with Donation
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Knowledge Support */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full text-sm sm:text-base py-2 sm:py-3">
                <Mail className="h-4 w-4 mr-2" />
                With Knowledge
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Contact Me</DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  Share your knowledge, ideas, or feedback
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        Abakatoviman2001@gmail.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        +32 484 49 96 39
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Feel free to reach out with suggestions, bug reports, or if you'd like to contribute to the project!
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};