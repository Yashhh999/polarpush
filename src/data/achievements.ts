import { Achievement } from '../types/game';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first level',
    icon: '🎯',
    type: 'progress',
    requirement: { type: 'levels_completed', value: 1 },
    reward: { coins: 50 },
    unlocked: false,
    progress: 0
  },
  {
    id: 'star_collector',
    name: 'Star Collector',
    description: 'Collect 10 stars',
    icon: '⭐',
    type: 'collection',
    requirement: { type: 'stars_collected', value: 10 },
    reward: { coins: 100, powerUps: ['extra_pole'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 5 levels under par time',
    icon: '⚡',
    type: 'speed',
    requirement: { type: 'par_time_beats', value: 5 },
    reward: { coins: 200, powerUps: ['time_slow'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete a level with all stars and under par time',
    icon: '💎',
    type: 'skill',
    requirement: { type: 'perfect_level', value: 1 },
    reward: { coins: 300, cosmetics: ['golden_player'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'magnetic_master',
    name: 'Magnetic Master',
    description: 'Place 1000 magnetic poles',
    icon: '🧲',
    type: 'progress',
    requirement: { type: 'poles_placed', value: 1000 },
    reward: { coins: 500, powerUps: ['super_magnet'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'world_conqueror',
    name: 'World Conqueror',
    description: 'Complete all levels in a world',
    icon: '👑',
    type: 'progress',
    requirement: { type: 'world_completed', value: 1 },
    reward: { coins: 1000 },
    unlocked: false,
    progress: 0
  },
  {
    id: 'creative_genius',
    name: 'Creative Genius',
    description: 'Complete a level using only negative poles',
    icon: '🎨',
    type: 'creative',
    requirement: { type: 'negative_only', value: 1 },
    reward: { coins: 250, cosmetics: ['red_player'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Complete a level using half the allowed poles',
    icon: '✨',
    type: 'skill',
    requirement: { type: 'minimal_poles', value: 1 },
    reward: { coins: 200 },
    unlocked: false,
    progress: 0
  }
];

export const getAchievementProgress = (achievement: Achievement, stats: any): number => {
  switch (achievement.requirement.type) {
    case 'levels_completed':
      return Math.min(stats.levelsCompleted, achievement.requirement.value);
    case 'stars_collected':
      return Math.min(stats.totalStars, achievement.requirement.value);
    case 'poles_placed':
      return Math.min(stats.polesPlaced, achievement.requirement.value);
    default:
      return achievement.progress;
  }
};