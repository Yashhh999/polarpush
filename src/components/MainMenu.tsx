import React from 'react';
import { Play, Settings, Trophy, Info, Zap } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (screen: string) => void;
  playerStats: any;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate, playerStats }) => {
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🧲 Polar Push
          </h1>
          <p className="text-gray-300 text-lg">Master the Magnetic Forces</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onNavigate('level_select')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
          >
            <Play size={20} className="inline mr-2" />
            Play Game
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Settings size={16} className="inline mr-2" />
            Settings
          </button>

          <button
            onClick={() => onNavigate('tutorial')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Info size={16} className="inline mr-2" />
            How to Play
          </button>
        </div>
      </div>
    </div>
  );
};