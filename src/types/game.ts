export interface Position {
  x: number;
  y: number;
}

export interface MagneticPole {
  id: string;
  position: Position;
  charge: 'positive' | 'negative';
  strength: number;
  type: 'standard' | 'super' | 'weak' | 'oscillating' | 'timed';
  duration?: number;
  oscillationPhase?: number;
}

export interface PowerUp {
  id: string;
  type: 'extra_pole' | 'super_magnet' | 'time_slow' | 'ghost_mode' | 'magnetic_boost' | 'pole_remover';
  name: string;
  description: string;
  icon: string;
  cost: number;
  duration?: number;
}

export interface Obstacle {
  position: Position;
  width: number;
  height: number;
  type: 'wall' | 'spike' | 'moving' | 'magnetic_barrier' | 'teleporter' | 'switch';
  properties?: {
    movementPattern?: Position[];
    speed?: number;
    teleportTarget?: Position;
    switchId?: string;
    isActive?: boolean;
  };
}

export interface Collectible {
  id: string;
  position: Position;
  type: 'star' | 'coin' | 'gem' | 'key';
  value: number;
  collected: boolean;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  world: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  start: Position;
  goal: Position;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  gridSize: { width: number; height: number };
  maxPoles: number;
  timeLimit?: number;
  parTime?: number;
  requiredStars?: number;
  unlockConditions?: {
    levelsCompleted?: number[];
    starsRequired?: number;
    achievementsRequired?: string[];
  };
  mechanics: string[];
  hints: string[];
}

export interface World {
  id: number;
  name: string;
  theme: string;
  description: string;
  unlockRequirement: number;
  levels: Level[];
  boss?: Level;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'progress' | 'skill' | 'collection' | 'speed' | 'creative';
  requirement: {
    type: string;
    value: number;
    levels?: number[];
  };
  reward: {
    coins?: number;
    powerUps?: string[];
    cosmetics?: string[];
  };
  unlocked: boolean;
  progress: number;
}

export interface PlayerStats {
  totalPlayTime: number;
  levelsCompleted: number;
  totalStars: number;
  totalCoins: number;
  perfectRuns: number;
  fastestTimes: { [levelId: number]: number };
  polesPlaced: number;
  achievements: Achievement[];
  unlockedCosmetics: string[];
  selectedCosmetic: string;
}

export interface GameState {
  currentScreen: 'menu' | 'world_select' | 'level_select' | 'game' | 'settings' | 'achievements' | 'shop';
  currentWorld: number;
  currentLevel: number;
  gameMode: 'design' | 'playing' | 'paused' | 'won' | 'lost';
  playerPos: Position;
  playerVelocity: Position;
  poles: MagneticPole[];
  activePowerUps: PowerUp[];
  trajectory: Position[];
  timeElapsed: number;
  starsCollected: number;
  coinsCollected: number;
  attempts: number;
  hintsUsed: number;
}

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  showTrajectory: boolean;
  showMagneticFields: boolean;
  showHints: boolean;
  difficulty: 'casual' | 'normal' | 'hardcore';
  controlScheme: 'mouse' | 'touch' | 'keyboard';
}