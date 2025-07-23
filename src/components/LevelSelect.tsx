import React from 'react';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import { WORLDS } from '../data/worlds';

interface LevelSelectProps {
  worldId: number;
  onNavigate: (screen: string) => void;
  onSelectLevel: (levelId: number) => void;
  playerStats: any;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ 
  worldId, 
  onNavigate, 
  onSelectLevel, 
  playerStats 
}) => {
  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];

  const getLevelStars = (levelId: number) => {
    return playerStats.levelStars?.[levelId] || 0;
  };

  const getBestTime = (levelId: number) => {
    return playerStats.fastestTimes?.[levelId];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('menu')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} className="inline mr-2" />
            Main Menu
          </button>
          <h1 className="text-3xl font-bold text-white">Choose Your Challenge</h1>
          <div className="w-32"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {world.levels.map((level) => {
            const stars = getLevelStars(level.id);
            const bestTime = getBestTime(level.id);
            const beatParTime = bestTime && level.parTime && bestTime <= level.parTime;

            return (
              <div
                key={level.id}
                className="bg-gray-700 hover:bg-gray-600 rounded-lg p-6 transition-colors cursor-pointer"
                onClick={() => onSelectLevel(level.id)}
              >
                <div className="text-center mb-3">
                  <div className="text-5xl font-bold text-white mb-2">{level.id}</div>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${getDifficultyColor(level.difficulty)}`}>
                    {level.difficulty.toUpperCase()}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white text-center mb-4">
                  {level.name}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`transition-all duration-300 ${
                          stars >= star 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-400'
                        }`}
                        size={16}
                      />
                    ))}
                  </div>

                  {bestTime && (
                    <div className="flex items-center justify-center gap-1">
                      <Clock size={12} className={`${beatParTime ? 'text-green-400' : 'text-blue-400'}`} />
                      <span className={`text-xs font-semibold ${beatParTime ? 'text-green-400' : 'text-blue-400'}`}>
                        {bestTime.toFixed(1)}s
                        {beatParTime && ' 🏆'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};