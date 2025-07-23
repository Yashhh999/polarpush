import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MainMenu } from './components/MainMenu';
import { WorldSelect } from './components/WorldSelect';
import { LevelSelect } from './components/LevelSelect';
import { GameHUD } from './components/GameHUD';
import { WORLDS } from './data/worlds';
import { ACHIEVEMENTS } from './data/achievements';
import { POWER_UPS } from './data/powerups';
import { 
  Position, 
  MagneticPole, 
  GameState, 
  PlayerStats, 
  Settings,
  Level,
  Obstacle,
  Collectible
} from './types/game';
import { 
  Play, 
  RotateCcw, 
  Target, 
  Plus, 
  Minus, 
  Star,
  Trophy,
  Home,
  Settings as SettingsIcon,
  Volume2,
  VolumeX
} from 'lucide-react';

const CELL_SIZE = 50;
const MAGNETIC_FORCE = 0.5;
const FRICTION = 0.95;
const MAX_SPEED = 8;

const defaultPlayerStats: PlayerStats = {
  totalPlayTime: 0,
  levelsCompleted: 0,
  totalStars: 0,
  totalCoins: 500, 
  perfectRuns: 0,
  fastestTimes: {},
  polesPlaced: 0,
  achievements: ACHIEVEMENTS,
  unlockedCosmetics: ['default'],
  selectedCosmetic: 'default'
};

const defaultSettings: Settings = {
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.7,
  musicVolume: 0.5,
  showTrajectory: true,
  showMagneticFields: false,
  showHints: true,
  difficulty: 'normal',
  controlScheme: 'mouse'
};

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: 'menu',
    currentWorld: 1,
    currentLevel: 1,
    gameMode: 'design',
    playerPos: { x: 1, y: 4 },
    playerVelocity: { x: 0, y: 0 },
    poles: [],
    activePowerUps: [],
    trajectory: [],
    timeElapsed: 0,
    starsCollected: 0,
    coinsCollected: 0,
    attempts: 0,
    hintsUsed: 0
  });

  const [playerStats, setPlayerStats] = useState<PlayerStats>(defaultPlayerStats);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [selectedPole, setSelectedPole] = useState<'positive' | 'negative'>('positive');
  const [showHint, setShowHint] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  const gameLoopRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const getCurrentLevel = (): Level | null => {
    const world = WORLDS.find(w => w.id === gameState.currentWorld);
    return world?.levels.find(l => l.id === gameState.currentLevel) || null;
  };

  const currentLevel = getCurrentLevel();

  const navigateToScreen = (screen: string) => {
    setGameState(prev => ({ ...prev, currentScreen: screen as any }));
  };

  const selectWorld = (worldId: number) => {
    setGameState(prev => ({ 
      ...prev, 
      currentWorld: worldId, 
      currentScreen: 'level_select' 
    }));
  };

  const selectLevel = (levelId: number) => {
    const world = WORLDS[0]; 
    const level = world.levels.find(l => l.id === levelId);
    
    if (level) {
      setGameState(prev => ({
        ...prev,
        currentWorld: 1,
        currentLevel: levelId,
        currentScreen: 'game',
        gameMode: 'design',
        playerPos: level.start,
        playerVelocity: { x: 0, y: 0 },
        poles: [],
        activePowerUps: [],
        trajectory: [],
        timeElapsed: 0,
        starsCollected: 0,
        coinsCollected: 0,
        attempts: 0,
        hintsUsed: 0
      }));
    }
  };

  const navigateToMenu = () => {
    setGameState(prev => ({ ...prev, currentScreen: 'menu' }));
  };

  const isObstacle = (x: number, y: number): boolean => {
    if (!currentLevel) return false;
    return currentLevel.obstacles.some(obstacle => {
      return x >= obstacle.position.x && 
             x < obstacle.position.x + obstacle.width &&
             y >= obstacle.position.y && 
             y < obstacle.position.y + obstacle.height;
    });
  };

  const isGoal = (x: number, y: number): boolean => {
    if (!currentLevel) return false;
    return Math.abs(x - currentLevel.goal.x) < 0.3 && Math.abs(y - currentLevel.goal.y) < 0.3;
  };

  const checkCollectibles = (x: number, y: number) => {
    if (!currentLevel) return;
    
    currentLevel.collectibles.forEach(collectible => {
      if (!collectible.collected && 
          Math.abs(x - collectible.position.x) < 0.5 && 
          Math.abs(y - collectible.position.y) < 0.5) {
        
        collectible.collected = true;
        
        if (collectible.type === 'star') {
          setGameState(prev => ({ ...prev, starsCollected: prev.starsCollected + 1 }));
        } else if (collectible.type === 'coin') {
          setGameState(prev => ({ ...prev, coinsCollected: prev.coinsCollected + collectible.value }));
        }
      }
    });
  };

  const calculateMagneticForce = (playerPos: Position, poles: MagneticPole[]): Position => {
    let totalForce = { x: 0, y: 0 };
    
    poles.forEach(pole => {
      const dx = pole.position.x - playerPos.x;
      const dy = pole.position.y - playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0.1) {
        const baseForce = MAGNETIC_FORCE * pole.strength;
        const force = baseForce / (distance * distance);
        const forceMultiplier = pole.charge === 'positive' ? 1 : -1;
        
        totalForce.x += (dx / distance) * force * forceMultiplier;
        totalForce.y += (dy / distance) * force * forceMultiplier;
      }
    });
    
    return totalForce;
  };

  const gameLoop = useCallback(() => {
    if (!currentLevel || gameState.gameMode !== 'playing') return;

    setGameState(prevState => {
      const force = calculateMagneticForce(prevState.playerPos, prevState.poles);
      
      let effectiveForce = { ...force };
      prevState.activePowerUps.forEach(powerUp => {
        if (powerUp.type === 'magnetic_boost') {
          effectiveForce.x *= 1.5;
          effectiveForce.y *= 1.5;
        }
      });

      const newVelocity = {
        x: (prevState.playerVelocity.x + effectiveForce.x) * FRICTION,
        y: (prevState.playerVelocity.y + effectiveForce.y) * FRICTION
      };
      
      const speed = Math.sqrt(newVelocity.x * newVelocity.x + newVelocity.y * newVelocity.y);
      if (speed > MAX_SPEED) {
        newVelocity.x = (newVelocity.x / speed) * MAX_SPEED;
        newVelocity.y = (newVelocity.y / speed) * MAX_SPEED;
      }
      
      const newPos = {
        x: prevState.playerPos.x + newVelocity.x * 0.016,
        y: prevState.playerPos.y + newVelocity.y * 0.016
      };
      
      if (newPos.x < 0 || newPos.x >= currentLevel.gridSize.width || 
          newPos.y < 0 || newPos.y >= currentLevel.gridSize.height) {
        return { ...prevState, gameMode: 'lost' };
      }
      
      const hasGhostMode = prevState.activePowerUps.some(p => p.type === 'ghost_mode');
      if (!hasGhostMode && isObstacle(Math.floor(newPos.x), Math.floor(newPos.y))) {
        return { ...prevState, gameMode: 'lost' };
      }
      
      checkCollectibles(newPos.x, newPos.y);
      
      if (isGoal(newPos.x, newPos.y)) {
        return { ...prevState, gameMode: 'won', playerPos: newPos };
      }
      
      if (currentLevel.timeLimit && prevState.timeElapsed >= currentLevel.timeLimit) {
        return { ...prevState, gameMode: 'lost' };
      }
      
      return {
        ...prevState,
        playerPos: newPos,
        playerVelocity: newVelocity,
        trajectory: [...prevState.trajectory, newPos].slice(-50),
        timeElapsed: prevState.timeElapsed + 0.016
      };
    });
    
    if (gameState.gameMode === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [currentLevel, gameState.gameMode]);

  useEffect(() => {
    if (gameState.gameMode === 'playing') {
      startTimeRef.current = Date.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameMode, gameLoop]);

  useEffect(() => {
    if (gameState.gameMode === 'won' && currentLevel) {
      let starsEarned = 1; 
      
      if (gameState.starsCollected === currentLevel.collectibles.filter(c => c.type === 'star').length) {
        starsEarned = Math.max(starsEarned, 2);
      }
      
      if (currentLevel.parTime && gameState.timeElapsed <= currentLevel.parTime) {
        starsEarned = 3; 
      }
      
      setPlayerStats(prev => ({
        ...prev,
        levelsCompleted: Math.max(prev.levelsCompleted, currentLevel.id),
        totalStars: prev.totalStars + Math.max(0, starsEarned - (prev.fastestTimes[currentLevel.id] ? 0 : 0)),
        totalCoins: prev.totalCoins + gameState.coinsCollected,
        fastestTimes: {
          ...prev.fastestTimes,
          [currentLevel.id]: Math.min(prev.fastestTimes[currentLevel.id] || Infinity, gameState.timeElapsed)
        },
        polesPlaced: prev.polesPlaced + gameState.poles.length
      }));
    }
  }, [gameState.gameMode, currentLevel, gameState.timeElapsed, gameState.starsCollected, gameState.coinsCollected, gameState.poles.length]);

  const startGame = () => {
    if (gameState.poles.length === 0) return;
    setGameState(prev => ({ 
      ...prev, 
      gameMode: 'playing',
      trajectory: [],
      attempts: prev.attempts + 1
    }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, gameMode: 'paused' }));
    setShowPauseMenu(true);
  };

  const resetLevel = () => {
    if (!currentLevel) return;
    
    setGameState(prev => ({
      ...prev,
      gameMode: 'design',
      playerPos: currentLevel.start,
      playerVelocity: { x: 0, y: 0 },
      poles: [],
      activePowerUps: [],
      trajectory: [],
      timeElapsed: 0,
      starsCollected: 0,
      coinsCollected: 0
    }));
    
    if (currentLevel.collectibles) {
      currentLevel.collectibles.forEach(c => c.collected = false);
    }
  };

  const handleGridClick = (x: number, y: number) => {
    if (!currentLevel || gameState.gameMode !== 'design') return;
    
    if (gameState.poles.length >= currentLevel.maxPoles) return;
    
    if (isObstacle(x, y) || 
        (x === currentLevel.start.x && y === currentLevel.start.y) || 
        (x === currentLevel.goal.x && y === currentLevel.goal.y)) {
      return;
    }
    
    if (gameState.poles.some(p => p.position.x === x && p.position.y === y)) {
      return;
    }
    
    const newPole: MagneticPole = {
      id: Date.now().toString(),
      position: { x, y },
      charge: selectedPole,
      strength: 1,
      type: 'standard'
    };
    
    setGameState(prev => ({
      ...prev,
      poles: [...prev.poles, newPole]
    }));
  };

  const removePole = (id: string) => {
    setGameState(prev => ({
      ...prev,
      poles: prev.poles.filter(pole => pole.id !== id)
    }));
  };

  const showHintHandler = () => {
    setShowHint(true);
    setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  };

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case 'menu':
        return (
          <MainMenu 
            onNavigate={navigateToScreen}
            playerStats={playerStats}
          />
        );
      
      case 'level_select':
        return (
          <LevelSelect
            worldId={1}
            onNavigate={navigateToScreen}
            onSelectLevel={selectLevel}
            playerStats={playerStats}
          />
        );
      
      case 'game':
        return renderGameScreen();
      
      default:
        return (
          <MainMenu 
            onNavigate={navigateToScreen}
            playerStats={playerStats}
          />
        );
    }
  };

  const renderGameScreen = () => {
    if (!currentLevel) return null;

    return (
      <div className="min-h-screen bg-slate-800 p-4">
        <div className="max-w-7xl mx-auto">
          <GameHUD
            level={currentLevel}
            gameState={gameState}
            timeElapsed={gameState.timeElapsed}
            starsCollected={gameState.starsCollected}
            coinsCollected={gameState.coinsCollected}
            poles={gameState.poles}
            selectedPole={selectedPole}
            activePowerUps={gameState.activePowerUps}
            onSetSelectedPole={setSelectedPole}
            onStartGame={startGame}
            onPauseGame={pauseGame}
            onResetLevel={resetLevel}
            onNavigate={navigateToScreen}
            onNavigateToMenu={navigateToMenu}
            onShowHint={showHintHandler}
            onUsePowerUp={() => {}}
          />

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-4">
            <div 
              className="grid gap-1 mx-auto relative"
              style={{
                gridTemplateColumns: `repeat(${currentLevel.gridSize.width}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${currentLevel.gridSize.height}, ${CELL_SIZE}px)`,
                width: `${currentLevel.gridSize.width * (CELL_SIZE + 4)}px`,
                height: `${currentLevel.gridSize.height * (CELL_SIZE + 4)}px`
              }}
            >
              {Array.from({ length: currentLevel.gridSize.height }, (_, row) =>
                Array.from({ length: currentLevel.gridSize.width }, (_, col) => {
                  const isObstacleCell = isObstacle(col, row);
                  const isStartCell = col === currentLevel.start.x && row === currentLevel.start.y;
                  const isGoalCell = col === currentLevel.goal.x && row === currentLevel.goal.y;
                  const pole = gameState.poles.find(p => p.position.x === col && p.position.y === row);
                  const collectible = currentLevel.collectibles.find(c => 
                    c.position.x === col && c.position.y === row && !c.collected
                  );
                  
                  return (
                    <div
                      key={`${row}-${col}`}
                      className={`w-12 h-12 border border-gray-600 relative cursor-pointer transition-colors ${
                        isObstacleCell ? 'bg-gray-800' :
                        isStartCell ? 'bg-green-500/40 hover:bg-green-500/60' :
                        isGoalCell ? 'bg-yellow-500/40 hover:bg-yellow-500/60' :
                        'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => handleGridClick(col, row)}
                    >
                      {isObstacleCell && (
                        <div className="w-full h-full bg-gray-900 border border-gray-600" />
                      )}
                      
                      {isStartCell && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                      )}
                      
                      {isGoalCell && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Target className="text-yellow-400" size={24} />
                        </div>
                      )}
                      
                      {collectible && (
                        <div className="w-full h-full flex items-center justify-center">
                          {collectible.type === 'star' && (
                            <Star className="text-yellow-400 fill-current" size={20} />
                          )}
                          {collectible.type === 'coin' && (
                            <div className="w-5 h-5 bg-yellow-400 rounded-full border border-yellow-600" />
                          )}
                        </div>
                      )}
                      
                      {pole && (
                        <div
                          className={`w-full h-full flex items-center justify-center cursor-pointer transition-colors ${
                            pole.charge === 'positive' 
                              ? 'bg-blue-500 hover:bg-blue-400' 
                              : 'bg-red-500 hover:bg-red-400'
                          } rounded-full border-2 border-white`}
                          onClick={(e) => {
                            e.stopPropagation();
                            removePole(pole.id);
                          }}
                        >
                          {pole.charge === 'positive' ? (
                            <Plus className="text-white" size={20} />
                          ) : (
                            <Minus className="text-white" size={20} />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              
              <div
                className="absolute w-6 h-6 bg-purple-500 rounded-full border-2 border-white z-10 transition-all duration-75"
                style={{
                  left: `${gameState.playerPos.x * (CELL_SIZE + 4) + CELL_SIZE/2 - 12}px`,
                  top: `${gameState.playerPos.y * (CELL_SIZE + 4) + CELL_SIZE/2 - 12}px`
                }}
              />
              
              {settings.showTrajectory && gameState.trajectory.map((pos, index) => (
                <div
                  key={index}
                  className="absolute w-2 h-2 bg-purple-300 rounded-full"
                  style={{
                    left: `${pos.x * (CELL_SIZE + 4) + CELL_SIZE/2 - 4}px`,
                    top: `${pos.y * (CELL_SIZE + 4) + CELL_SIZE/2 - 4}px`,
                    opacity: Math.max(0.1, index / gameState.trajectory.length)
                  }}
                />
              ))}
            </div>
          </div>

          {gameState.gameMode === 'won' && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Level Complete!</h2>
                  <p className="text-gray-600 mb-6">
                    {gameState.timeElapsed <= (currentLevel?.parTime || Infinity) 
                      ? "Amazing speed! Perfect timing!" 
                      : gameState.starsCollected === 3 
                        ? "Perfect! All stars collected!" 
                        : "Well done! Great magnetic control!"}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        gameState.timeElapsed <= (currentLevel?.parTime || Infinity) ? 'text-green-600' : 'text-blue-600'
                      }`}>{gameState.timeElapsed.toFixed(1)}s</div>
                      <div className="text-sm text-gray-500">Time</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        gameState.starsCollected === 3 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>{gameState.starsCollected}/3</div>
                      <div className="text-sm text-gray-500">Stars</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{gameState.coinsCollected}</div>
                      <div className="text-sm text-gray-500">Coins</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <button
                        onClick={resetLevel}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={() => navigateToScreen('level_select')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        {currentLevel?.id === 10 ? 'All Levels' : 'Next Level'}
                      </button>
                    </div>
                    <button
                      onClick={navigateToMenu}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Main Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gameState.gameMode === 'lost' && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="text-6xl mb-4">💥</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Try Again!</h2>
                  <p className="text-gray-600 mb-6">
                    {currentLevel?.timeLimit && gameState.timeElapsed >= currentLevel.timeLimit
                      ? "Time's up! Try a faster approach."
                      : "Hit an obstacle! Adjust your magnetic strategy."}
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <button
                        onClick={resetLevel}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => navigateToScreen('level_select')}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Choose Level
                      </button>
                    </div>
                    <button
                      onClick={navigateToMenu}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Main Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showPauseMenu && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="text-4xl mb-4">⏸️</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Paused</h2>
                  <p className="text-gray-600 mb-6">Take your time to plan your next move!</p>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setShowPauseMenu(false);
                        setGameState(prev => ({ ...prev, gameMode: 'playing' }));
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                      Resume Game
                    </button>
                    <button
                      onClick={() => {
                        setShowPauseMenu(false);
                        resetLevel();
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                      Restart Level
                    </button>
                    <button
                      onClick={() => {
                        setShowPauseMenu(false);
                        navigateToScreen('level_select');
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                      Level Select
                    </button>
                    <button
                      onClick={() => {
                        setShowPauseMenu(false);
                        navigateToMenu();
                      }}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                      Main Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showHint && currentLevel && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Hint</h3>
                  <p className="text-gray-600 mb-6">
                    {currentLevel.hints[Math.min(gameState.hintsUsed, currentLevel.hints.length - 1)]}
                  </p>
                  <button
                    onClick={() => setShowHint(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderCurrentScreen();
}

export default App;