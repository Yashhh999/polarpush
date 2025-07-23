import React from 'react';
import { ArrowLeft, Lock, Star, Trophy } from 'lucide-react';
import { WORLDS } from '../data/worlds';

interface WorldSelectProps {
  onNavigate: (screen: string) => void;
  onSelectWorld: (worldId: number) => void;
  playerStats: any;
}

export const WorldSelect: React.FC<WorldSelectProps> = ({ onNavigate, onSelectWorld, playerStats }) => {
  const getWorldProgress = (worldId: number) => {
    const world = WORLDS.find(w => w.id === worldId);
    if (!world) return { completed: 0, total: 0, stars: 0 };
    
    const completed = world.levels.filter(level => 
      playerStats.completedLevels?.includes(level.id)
    ).length;
    
    const stars = world.levels.reduce((total, level) => {
      return total + (playerStats.levelStars?.[level.id] || 0);
    }, 0);
    
    return { completed, total: world.levels.length, stars };
  };

  const isWorldUnlocked = (world: any) => {
    return playerStats.levelsCompleted >= world.unlockRequirement;
  };

  const getWorldThemeColors = (theme: string) => {
    switch (theme) {
      case 'nature': return 'from-green-600 to-emerald-700';
      case 'cave': return 'from-purple-600 to-indigo-700';
      case 'tech': return 'from-blue-600 to-cyan-700';
      case 'space': return 'from-gray-700 to-slate-800';
      default: return 'from-blue-600 to-purple-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={24} />
            Back to Menu
          </button>
          <h1 className="text-3xl font-bold text-white">Select World</h1>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WORLDS.map((world) => {
            const progress = getWorldProgress(world.id);
            const unlocked = isWorldUnlocked(world);
            const themeColors = getWorldThemeColors(world.theme);

            return (
              <div
                key={world.id}
                className={`relative overflow-hidden rounded-xl transition-all transform hover:scale-105 ${
                  unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => unlocked && onSelectWorld(world.id)}
              >
                <div className={`bg-gradient-to-br ${themeColors} p-6 h-48`}>
                  {!unlocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="text-white mx-auto mb-2" size={32} />
                        <p className="text-white font-semibold">
                          Complete {world.unlockRequirement} levels to unlock
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white">{world.name}</h3>
                      <div className="text-right">
                        <div className="text-white text-sm">World {world.id}</div>
                      </div>
                    </div>
                    
                    <p className="text-white/90 text-sm mb-4">{world.description}</p>

                    {unlocked && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-white text-sm">
                          <span>Progress: {progress.completed}/{progress.total}</span>
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-400" size={16} />
                            <span>{progress.stars}</span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-white rounded-full h-2 transition-all"
                            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                          />
                        </div>

                        {progress.completed === progress.total && (
                          <div className="flex items-center gap-1 text-yellow-400 text-sm">
                            <Trophy size={16} />
                            <span>Completed!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Quantum Realm', 'Time Vortex', 'Parallel Dimensions'].map((name, index) => (
              <div key={name} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 opacity-50">
                <h3 className="text-white font-semibold mb-2">{name}</h3>
                <p className="text-blue-200 text-sm">New challenges await...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};