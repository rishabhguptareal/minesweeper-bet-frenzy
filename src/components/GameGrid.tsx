
import { useEffect, useState } from 'react';
import GameTile from './GameTile';

interface GameGridProps {
  onGameOver: (won: boolean) => void;
  isActive: boolean;
  onMultiplierChange: (multiplier: number) => void;
}

const GameGrid = ({ onGameOver, isActive, onMultiplierChange }: GameGridProps) => {
  const [tiles, setTiles] = useState<Array<{ isMine: boolean; isRevealed: boolean }>>(
    Array(9).fill({ isMine: false, isRevealed: false })
  );
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (isActive) {
      // Place one mine randomly
      const newTiles = Array(9).fill({ isMine: false, isRevealed: false });
      const mineIndex = Math.floor(Math.random() * 9);
      newTiles[mineIndex] = { ...newTiles[mineIndex], isMine: true };
      setTiles(newTiles);
      setRevealedCount(0);
    }
  }, [isActive]);

  const handleReveal = (index: number) => {
    if (!isActive) return;

    const newTiles = [...tiles];
    newTiles[index] = { ...newTiles[index], isRevealed: true };
    setTiles(newTiles);

    if (newTiles[index].isMine) {
      onGameOver(false);
    } else {
      const newRevealedCount = revealedCount + 1;
      setRevealedCount(newRevealedCount);
      const newMultiplier = 1 + (newRevealedCount * 0.5);
      onMultiplierChange(newMultiplier);

      if (newRevealedCount === 4) {
        onGameOver(true);
      }
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-game-bg rounded-xl border border-game-border">
      {tiles.map((tile, index) => (
        <GameTile
          key={index}
          index={index}
          isMine={tile.isMine}
          isRevealed={tile.isRevealed}
          onReveal={handleReveal}
          disabled={!isActive}
        />
      ))}
    </div>
  );
};

export default GameGrid;
