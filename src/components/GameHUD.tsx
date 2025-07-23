import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Home, 
  ArrowLeft,
  Star, 
  Clock,
  Plus,
  Minus
} from 'lucide-react';

interface GameHUDProps {
  level: any;
  gameState: any;
  timeElapsed: number;
  starsCollected: number;
  coinsCollected: number;
  poles: any[];
  selectedPole: 'positive' | 'negative';
  activePowerUps: any[];
  onSetSelectedPole: (type: 'positive' | 'negative') => void;
  onStartGame: () => void;
  onPauseGame: () => void;
  onResetLevel: () => void;
  onNavigate: (screen: string) => void;
  onNavigateToMenu: () => void;
  onShowHint: () => void;
  onUsePowerUp: (powerUpId: string) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  level,
  gameState,
  timeElapsed,
  starsCollected,
  poles,
  selectedPole,
  onSetSelectedPole,
  onStartGame,
  onPauseGame,
  onResetLevel,
  onNavigate,
  onNavigateToMenu
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToMenu}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-all"
          >
            <Home size={16} />
            Menu
          </button>
          
          <button
            onClick={() => onNavigate('level_select')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all"
          >
            <ArrowLeft size={16} />
            Levels
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Level {level.id}</h2>
          <p className="text-sm text-blue-200">{level.name}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-400" size={18} />
            <span className="text-white font-mono">{formatTime(timeElapsed)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" size={18} />
            <span className="text-white">{starsCollected}/3</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetSelectedPole('positive')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
              selectedPole === 'positive' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/20 text-blue-200 hover:bg-white/30'
            }`}
          >
            <Plus size={16} />
            Positive
          </button>
          <button
            onClick={() => onSetSelectedPole('negative')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
              selectedPole === 'negative' 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-red-200 hover:bg-white/30'
            }`}
          >
            <Minus size={16} />
            Negative
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white text-sm">
            Poles: {poles.length}/{level.maxPoles}
          </span>

          {gameState.gameMode === 'design' ? (
            <button
              onClick={onStartGame}
              disabled={poles.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
            >
              <Play size={16} />
              Start
            </button>
          ) : gameState.gameMode === 'playing' ? (
            <button
              onClick={onPauseGame}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-all"
            >
              <Pause size={16} />
              Pause
            </button>
          ) : (
            <button
              onClick={onStartGame}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
            >
              <Play size={16} />
              Resume
            </button>
          )}

          <button
            onClick={onResetLevel}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};