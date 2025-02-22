
interface GameStatsProps {
  betAmount: number;
  multiplier: number;
  potentialWin: number;
}

const GameStats = ({ betAmount, multiplier, potentialWin }: GameStatsProps) => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-game-bg rounded-xl border border-game-border animate-fade-in">
      <div className="flex justify-between items-center">
        <span className="text-game-text">Bet Amount:</span>
        <span className="text-game-accent font-bold">{betAmount.toFixed(2)} APT</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-game-text">Current Multiplier:</span>
        <span className="text-game-accent font-bold">{multiplier.toFixed(2)}x</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-game-text">Potential Win:</span>
        <span className="text-game-success font-bold">{potentialWin.toFixed(2)} APT</span>
      </div>
    </div>
  );
};

export default GameStats;
