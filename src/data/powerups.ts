import { PowerUp } from '../types/game';

export const POWER_UPS: PowerUp[] = [
  {
    id: 'extra_pole',
    type: 'extra_pole',
    name: 'Extra Pole',
    description: 'Place one additional magnetic pole',
    icon: '➕',
    cost: 100
  },
  {
    id: 'super_magnet',
    type: 'super_magnet',
    name: 'Super Magnet',
    description: 'Next pole has 2x magnetic strength',
    icon: '🧲',
    cost: 150
  },
  {
    id: 'time_slow',
    type: 'time_slow',
    name: 'Time Slow',
    description: 'Slow down time for 10 seconds',
    icon: '⏰',
    cost: 200,
    duration: 10
  },
  {
    id: 'ghost_mode',
    type: 'ghost_mode',
    name: 'Ghost Mode',
    description: 'Pass through obstacles for 5 seconds',
    icon: '👻',
    cost: 300,
    duration: 5
  },
  {
    id: 'magnetic_boost',
    type: 'magnetic_boost',
    name: 'Magnetic Boost',
    description: 'All magnetic forces are 50% stronger',
    icon: '⚡',
    cost: 250,
    duration: 15
  },
  {
    id: 'pole_remover',
    type: 'pole_remover',
    name: 'Pole Remover',
    description: 'Remove and replace poles during gameplay',
    icon: '🔄',
    cost: 180
  }
];