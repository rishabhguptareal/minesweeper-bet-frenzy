
import { useState } from 'react';
import { bomb, check } from 'lucide-react';

interface GameTileProps {
  index: number;
  isMine: boolean;
  isRevealed: boolean;
  onReveal: (index: number) => void;
  disabled: boolean;
}

const GameTile = ({ index, isMine, isRevealed, onReveal, disabled }: GameTileProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`w-24 h-24 rounded-lg transition-all duration-300 relative overflow-hidden
        ${isRevealed ? 'animate-tile-reveal' : 'hover:animate-tile-hover'}
        ${!isRevealed && !disabled ? 'bg-game-tile-default cursor-pointer' : 'bg-game-tile-revealed cursor-not-allowed'}
        ${disabled && !isRevealed ? 'opacity-50' : 'opacity-100'}
        border-2 border-game-border`}
      onClick={() => !isRevealed && !disabled && onReveal(index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isRevealed || disabled}
    >
      {isRevealed && (
        <div className="flex items-center justify-center w-full h-full">
          {isMine ? (
            <bomb className="w-8 h-8 text-game-danger" />
          ) : (
            <check className="w-8 h-8 text-game-success" />
          )}
        </div>
      )}
    </button>
  );
};

export default GameTile;
