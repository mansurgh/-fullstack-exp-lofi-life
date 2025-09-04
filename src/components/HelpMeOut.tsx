import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Mail, Phone, CreditCard, Copy, Check } from 'lucide-react';

export const HelpMeOut = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [copiedField, setCopiedField] = useState('');

  const paymentMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer (SEPA)',
      icon: '🏦',
      details: {
        iban: 'BE86 0637 1216 5850',
        swift: 'GEBABEBB',
        bank: 'BNP Paribas Fortis',
        holder: 'Abakarov Iman'
      }
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '💳',
      details: {
        email: 'Abakatoviman2001@gmail.com'
      }
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: '₿',
      details: {
        bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        usdt: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'
      }
    }
  ];

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDonation = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    
    alert(`Thank you for wanting to donate! Please use the selected payment method.`);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 sm:mt-8 px-4">
      <Card className="bg-white/95 backdrop-blur-sm border-gray-300 shadow-lg">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="flex items-center justify-center gap-2 text-gray-900 text-lg sm:text-xl">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            Help Me Out
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-700">
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
            <DialogContent className="w-[95vw] max-w-lg mx-auto bg-white text-gray-900">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl text-gray-900">Support with Donation</DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-700">
                  Choose a payment method to support the development of this project
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-black">
                    Payment Method
                  </label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger className="bg-white border-gray-300 text-black">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id} className="text-black hover:bg-gray-100">
                          <span className="flex items-center gap-2">
                            <span>{method.icon}</span>
                            {method.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedMethod && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-black">
                      Payment Details:
                    </p>
                    {selectedMethod === 'bank' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded border">
                          <span className="text-sm text-black">IBAN:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono text-black bg-white px-2 py-1 rounded border">{paymentMethods[0].details.iban}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(paymentMethods[0].details.iban || '', 'iban')}
                              className="text-black hover:bg-gray-200"
                            >
                              {copiedField === 'iban' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded border">
                          <span className="text-sm text-black">SWIFT:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono text-black bg-white px-2 py-1 rounded border">{paymentMethods[0].details.swift}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(paymentMethods[0].details.swift || '', 'swift')}
                              className="text-black hover:bg-gray-200"
                            >
                              {copiedField === 'swift' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                          Bank: {paymentMethods[0].details.bank} | Holder: {paymentMethods[0].details.holder}
                        </div>
                      </div>
                    )}
                    
                    {selectedMethod === 'paypal' && (
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded border">
                        <span className="text-sm text-black">PayPal Email:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-black bg-white px-2 py-1 rounded border">{paymentMethods[1].details.email}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                                                          onClick={() => copyToClipboard(paymentMethods[1].details.email || '', 'paypal')}
                            className="text-black hover:bg-gray-200"
                          >
                            {copiedField === 'paypal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {selectedMethod === 'crypto' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded border">
                          <span className="text-sm text-black">Bitcoin:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-black bg-white px-2 py-1 rounded border truncate max-w-[200px]">{paymentMethods[2].details.bitcoin}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(paymentMethods[2].details.bitcoin || '', 'bitcoin')}
                              className="text-black hover:bg-gray-200"
                            >
                              {copiedField === 'bitcoin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded border">
                          <span className="text-sm text-black">Ethereum:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-black bg-white px-2 py-1 rounded border truncate max-w-[200px]">{paymentMethods[2].details.ethereum}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(paymentMethods[2].details.ethereum || '', 'ethereum')}
                              className="text-black hover:bg-gray-200"
                            >
                              {copiedField === 'ethereum' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded border">
                          <span className="text-sm text-black">USDT (TRC20):</span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-black bg-white px-2 py-1 rounded border truncate max-w-[200px]">{paymentMethods[2].details.usdt}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(paymentMethods[2].details.usdt || '', 'usdt')}
                              className="text-black hover:bg-gray-200"
                            >
                              {copiedField === 'usdt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                

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
            <DialogContent className="w-[95vw] max-w-md mx-auto bg-white text-gray-900">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl text-gray-900">Contact Me</DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-700">
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