
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AptosWindow extends Window {
  aptos?: any;
}

declare const window: AptosWindow;

const WalletButton = () => {
  const [address, setAddress] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (window.aptos) {
        const response = await window.aptos.connect();
        setAddress(response.address);
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.aptos) {
        toast({
          title: "Petra Wallet Not Found",
          description: "Please install Petra Wallet extension first.",
          variant: "destructive",
        });
        window.open('https://petra.app/', '_blank');
        return;
      }

      const response = await window.aptos.connect();
      setAddress(response.address);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Petra Wallet",
      });
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Petra Wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.aptos.disconnect();
      setAddress('');
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from Petra Wallet",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
  };

  return (
    <Button
      onClick={address ? disconnectWallet : connectWallet}
      className="bg-game-accent hover:bg-game-accent/80 text-white"
    >
      {address ? `Connected: ${formatAddress(address)}` : 'Connect Wallet'}
    </Button>
  );
};

export default WalletButton;
