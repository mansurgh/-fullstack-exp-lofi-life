import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTranslation } from '@/contexts/TranslationContext';
import { Check, Copy, CreditCard, Heart, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export const HelpMeOut = () => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState('');

  const paypalEmail = 'Abakatoviman2001@gmail.com';

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 sm:mt-8 px-4">
      <Card className="bg-white/95 backdrop-blur-sm border-gray-300 shadow-lg">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="flex items-center justify-center gap-2 text-gray-900 text-lg sm:text-xl">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            {t('help.title')}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-700">
            {t('help.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {/* PayPal Donation */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="w-full text-sm sm:text-base py-2 sm:py-3">
                <CreditCard className="h-4 w-4 mr-2" />
                {t('help.with.money')}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-lg mx-auto bg-white text-gray-900">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl text-gray-900">{t('help.donation.title')}</DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-700">
                  {t('help.donation.subtitle')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-2xl">💳</span>
                  <span className="font-semibold text-blue-800">PayPal</span>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded border">
                  <span className="text-sm text-black">PayPal Email:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-black bg-white px-2 py-1 rounded border">{paypalEmail}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(paypalEmail, 'paypal')}
                      className="text-black hover:bg-gray-200"
                    >
                      {copiedField === 'paypal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <a
                  href="https://paypal.me/abakatoviman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {t('help.open.paypal')}
                  </Button>
                </a>
              </div>
            </DialogContent>
          </Dialog>

          {/* Knowledge Support */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full text-sm sm:text-base py-2 sm:py-3">
                <Mail className="h-4 w-4 mr-2" />
                {t('help.with.knowledge')}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto bg-white text-gray-900">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl text-gray-900">{t('help.contact.title')}</DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-700">
                  {t('help.contact.subtitle')}
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
                      <p className="text-sm font-medium">{t('help.phone')}</p>
                      <p className="text-sm text-muted-foreground">
                        +32 484 49 96 39
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {t('help.contact.message')}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div >
  );
};