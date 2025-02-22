
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BetControlsProps {
  onPlaceBet: (amount: number) => void;
  onCashOut: () => void;
  isActive: boolean;
  disabled: boolean;
}

const BetControls = ({ onPlaceBet, onCashOut, isActive, disabled }: BetControlsProps) => {
  const [betAmount, setBetAmount] = useState('0.1');

  const handlePlaceBet = () => {
    const amount = parseFloat(betAmount);
    if (amount > 0) {
      onPlaceBet(amount);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          min="0.1"
          step="0.1"
          disabled={isActive || disabled}
          className="bg-game-tile-default text-game-text border-game-border"
        />
        {!isActive ? (
          <Button
            onClick={handlePlaceBet}
            disabled={disabled}
            className="bg-game-accent hover:bg-game-accent/80 text-white"
          >
            Place Bet
          </Button>
        ) : (
          <Button
            onClick={onCashOut}
            disabled={disabled}
            className="bg-game-success hover:bg-game-success/80 text-white"
          >
            Cash Out
          </Button>
        )}
      </div>
    </div>
  );
};

export default BetControls;
