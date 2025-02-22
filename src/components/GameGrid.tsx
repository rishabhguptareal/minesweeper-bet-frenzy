
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
      // Reset game state when a new game starts
      const newTiles = Array(9).fill({ isMine: false, isRevealed: false });
      setTiles(newTiles);
      setRevealedCount(0);
    }
  }, [isActive]);

  const handleReveal = async (index: number) => {
    if (!isActive) return;

    const newTiles = [...tiles];
    newTiles[index] = { ...newTiles[index], isRevealed: true };
    setTiles(newTiles);

    // Update game stats locally (will be overwritten by blockchain state)
    const newRevealedCount = revealedCount + 1;
    setRevealedCount(newRevealedCount);
    const newMultiplier = 1 + (newRevealedCount * 0.5);
    onMultiplierChange(newMultiplier);

    // The actual game state will be managed by the smart contract
    window.parent.postMessage({ type: 'REVEAL_TILE', index }, '*');
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
