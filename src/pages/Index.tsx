import { useState } from 'react';
import GameGrid from '@/components/GameGrid';
import GameStats from '@/components/GameStats';
import BetControls from '@/components/BetControls';
import WalletButton from '@/components/WalletButton';
import { useToast } from '@/hooks/use-toast';

interface AptosWindow extends Window {
  aptos?: any;
}

declare const window: AptosWindow;

const SMART_CONTRACT_ADDRESS = "0x1"; // Replace with your deployed contract address

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePlaceBet = async (amount: number) => {
    try {
      if (!window.aptos) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your Petra Wallet first",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      const transaction = {
        type: "entry_function_payload",
        function: `${SMART_CONTRACT_ADDRESS}::mines::place_bet`,
        arguments: [Math.floor(amount * 100000000)], // Convert APT to Octas
        type_arguments: [],
      };

      const response = await window.aptos.signAndSubmitTransaction(transaction);
      await window.aptos.waitForTransaction(response.hash);

      setBetAmount(amount);
      setIsActive(true);
      setMultiplier(1);
      
      toast({
        title: "Bet placed successfully!",
        description: `${amount} APT has been placed.`,
      });
    } catch (error: any) {
      console.error('Error placing bet:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to place bet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashOut = async () => {
    try {
      if (!window.aptos) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your Petra Wallet first",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      const transaction = {
        type: "entry_function_payload",
        function: `${SMART_CONTRACT_ADDRESS}::mines::cash_out`,
        arguments: [],
        type_arguments: [],
      };

      const response = await window.aptos.signAndSubmitTransaction(transaction);
      await window.aptos.waitForTransaction(response.hash);

      const winnings = betAmount * multiplier;
      setIsActive(false);
      setBetAmount(0);
      setMultiplier(1);

      toast({
        title: "Cash out successful!",
        description: `You won ${winnings.toFixed(2)} APT!`,
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error cashing out:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to cash out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevealTile = async (index: number) => {
    try {
      if (!window.aptos) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your Petra Wallet first",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      const transaction = {
        type: "entry_function_payload",
        function: `${SMART_CONTRACT_ADDRESS}::mines::reveal_tile`,
        arguments: [index],
        type_arguments: [],
      };

      const response = await window.aptos.signAndSubmitTransaction(transaction);
      await window.aptos.waitForTransaction(response.hash);

      // The game state will be updated through the contract response
      // For now, we'll keep the local state management for demo purposes
    } catch (error: any) {
      console.error('Error revealing tile:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to reveal tile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameOver = (won: boolean) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsActive(false);
      setBetAmount(0);
      setMultiplier(1);
      setIsLoading(false);
      toast({
        title: won ? "Congratulations!" : "Game Over!",
        description: won
          ? `You won ${(betAmount * multiplier).toFixed(2)} APT!`
          : "Better luck next time!",
        variant: won ? "default" : "destructive",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-game-bg text-game-text p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mines Game</h1>
          <WalletButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <GameGrid
              onGameOver={handleGameOver}
              isActive={isActive}
              onMultiplierChange={setMultiplier}
            />
            <BetControls
              onPlaceBet={handlePlaceBet}
              onCashOut={handleCashOut}
              isActive={isActive}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col gap-8">
            <GameStats
              betAmount={betAmount}
              multiplier={multiplier}
              potentialWin={betAmount * multiplier}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
