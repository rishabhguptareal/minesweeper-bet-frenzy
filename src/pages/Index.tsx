
import { useState } from 'react';
import GameGrid from '@/components/GameGrid';
import GameStats from '@/components/GameStats';
import BetControls from '@/components/BetControls';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePlaceBet = (amount: number) => {
    setIsLoading(true);
    // Simulating blockchain transaction
    setTimeout(() => {
      setBetAmount(amount);
      setIsActive(true);
      setMultiplier(1);
      setIsLoading(false);
      toast({
        title: "Bet placed successfully!",
        description: `${amount} APT has been placed.`,
      });
    }, 1500);
  };

  const handleCashOut = () => {
    setIsLoading(true);
    // Simulating blockchain transaction
    setTimeout(() => {
      const winnings = betAmount * multiplier;
      setIsActive(false);
      setBetAmount(0);
      setMultiplier(1);
      setIsLoading(false);
      toast({
        title: "Cash out successful!",
        description: `You won ${winnings.toFixed(2)} APT!`,
        variant: "default",
      });
    }, 1500);
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
        <h1 className="text-4xl font-bold text-center mb-8">Mines Game</h1>
        
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
