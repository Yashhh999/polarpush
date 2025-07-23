import { World, Level } from '../types/game';

export const WORLDS: World[] = [
  {
    id: 1,
    name: "Magnetic Basics",
    theme: "nature",
    description: "Learn the fundamentals of magnetic manipulation",
    unlockRequirement: 0,
    levels: [
      {
        id: 1,
        name: "Magnetic Discovery",
        description: "Your first taste of magnetic power - feel the pull!",
        world: 1,
        difficulty: 'easy',
        start: { x: 1, y: 4 },
        goal: { x: 7, y: 4 },
        obstacles: [],
        collectibles: [
          { id: '1-1', position: { x: 4, y: 4 }, type: 'star', value: 1, collected: false },
          { id: '1-2', position: { x: 5, y: 3 }, type: 'coin', value: 10, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 1,
        parTime: 5,
        mechanics: ['basic_magnetism'],
        hints: ["Place a blue positive pole near the goal - watch yourself get pulled toward it!"]
      },
      {
        id: 2,
        name: "Around the Corner",
        description: "Navigate around the wall using magnetic forces",
        world: 1,
        difficulty: 'easy',
        start: { x: 1, y: 2 },
        goal: { x: 8, y: 5 },
        obstacles: [
          { position: { x: 4, y: 1 }, width: 1, height: 5, type: 'wall' }
        ],
        collectibles: [
          { id: '2-1', position: { x: 2, y: 5 }, type: 'star', value: 1, collected: false },
          { id: '2-2', position: { x: 6, y: 2 }, type: 'star', value: 1, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 2,
        parTime: 8,
        mechanics: ['basic_magnetism'],
        hints: ["Place poles to pull yourself around the wall!"]
      },
      {
        id: 3,
        name: "Push and Pull",
        description: "Learn to use both attraction and repulsion",
        world: 1,
        difficulty: 'easy',
        start: { x: 2, y: 6 },
        goal: { x: 7, y: 2 },
        obstacles: [
          { position: { x: 4, y: 4 }, width: 2, height: 2, type: 'wall' }
        ],
        collectibles: [
          { id: '3-1', position: { x: 5, y: 6 }, type: 'star', value: 1, collected: false },
          { id: '3-2', position: { x: 3, y: 2 }, type: 'coin', value: 15, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 2,
        parTime: 10,
        mechanics: ['basic_magnetism', 'repulsion'],
        hints: ["Red poles push you away! Use them to change direction."]
      },
      {
        id: 4,
        name: "Threading the Needle",
        description: "Precision is key - one wrong move and you'll hit the spikes!",
        world: 1,
        difficulty: 'medium',
        start: { x: 0, y: 4 },
        goal: { x: 9, y: 4 },
        obstacles: [
          { position: { x: 3, y: 1 }, width: 1, height: 2, type: 'wall' },
          { position: { x: 3, y: 5 }, width: 1, height: 2, type: 'wall' },
          { position: { x: 6, y: 1 }, width: 1, height: 2, type: 'wall' },
          { position: { x: 6, y: 5 }, width: 1, height: 2, type: 'wall' }
        ],
        collectibles: [
          { id: '4-1', position: { x: 4, y: 4 }, type: 'star', value: 1, collected: false },
          { id: '4-2', position: { x: 2, y: 4 }, type: 'coin', value: 20, collected: false },
          { id: '4-3', position: { x: 7, y: 4 }, type: 'coin', value: 20, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 3,
        parTime: 12,
        mechanics: ['basic_magnetism', 'precision'],
        hints: ["Use gentle forces! Place poles further away for softer pulls and pushes."]
      },
      {
        id: 5,
        name: "The Magnetic Maze",
        description: "A winding path that tests your magnetic mastery",
        world: 1,
        difficulty: 'medium',
        start: { x: 1, y: 7 },
        goal: { x: 8, y: 1 },
        obstacles: [
          { position: { x: 3, y: 5 }, width: 1, height: 3, type: 'wall' },
          { position: { x: 4, y: 3 }, width: 3, height: 1, type: 'wall' },
          { position: { x: 6, y: 0 }, width: 1, height: 3, type: 'wall' }
        ],
        collectibles: [
          { id: '5-1', position: { x: 2, y: 4 }, type: 'star', value: 1, collected: false },
          { id: '5-2', position: { x: 5, y: 6 }, type: 'star', value: 1, collected: false },
          { id: '5-3', position: { x: 7, y: 3 }, type: 'star', value: 1, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 4,
        parTime: 15,
        mechanics: ['basic_magnetism', 'complex_navigation'],
        hints: ["Plan your route! Sometimes you need to zigzag to collect all the stars."]
      },
      {
        id: 6,
        name: "Magnetic Pinball",
        description: "Bounce between forces like a pinball - but with purpose!",
        world: 1,
        difficulty: 'medium',
        start: { x: 1, y: 7 },
        goal: { x: 8, y: 1 },
        obstacles: [
          { position: { x: 3, y: 2 }, width: 1, height: 3, type: 'wall' },
          { position: { x: 6, y: 3 }, width: 1, height: 3, type: 'wall' },
          { position: { x: 4, y: 0 }, width: 2, height: 1, type: 'wall' }
        ],
        collectibles: [
          { id: '6-1', position: { x: 2, y: 4 }, type: 'star', value: 1, collected: false },
          { id: '6-2', position: { x: 5, y: 2 }, type: 'star', value: 1, collected: false },
          { id: '6-3', position: { x: 7, y: 5 }, type: 'coin', value: 25, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 4,
        parTime: 18,
        mechanics: ['basic_magnetism', 'multiple_obstacles'],
        hints: ["Create a magnetic pinball effect! Use alternating poles to bounce around obstacles."]
      },
      {
        id: 7,
        name: "The Gauntlet",
        description: "A treacherous path that demands magnetic mastery",
        world: 1,
        difficulty: 'hard',
        start: { x: 0, y: 7 },
        goal: { x: 9, y: 0 },
        obstacles: [
          { position: { x: 2, y: 5 }, width: 1, height: 2, type: 'wall' },
          { position: { x: 4, y: 4 }, width: 1, height: 3, type: 'wall' },
          { position: { x: 6, y: 2 }, width: 1, height: 3, type: 'wall' },
          { position: { x: 7, y: 6 }, width: 2, height: 1, type: 'wall' }
        ],
        collectibles: [
          { id: '7-1', position: { x: 1, y: 5 }, type: 'star', value: 1, collected: false },
          { id: '7-2', position: { x: 3, y: 3 }, type: 'star', value: 1, collected: false },
          { id: '7-3', position: { x: 5, y: 1 }, type: 'star', value: 1, collected: false },
          { id: '7-4', position: { x: 8, y: 4 }, type: 'coin', value: 30, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 5,
        parTime: 25,
        mechanics: ['basic_magnetism', 'complex_navigation'],
        hints: ["This is a test of patience and precision. Plan each magnetic pull carefully!"]
      },
      {
        id: 8,
        name: "The Magnetic Slingshot",
        description: "Build up speed and launch yourself across the void!",
        world: 1,
        difficulty: 'hard',
        start: { x: 1, y: 3 },
        goal: { x: 8, y: 5 },
        obstacles: [
          { position: { x: 3, y: 0 }, width: 1, height: 3, type: 'wall' },
          { position: { x: 3, y: 5 }, width: 1, height: 3, type: 'wall' },
          { position: { x: 6, y: 0 }, width: 1, height: 3, type: 'wall' },
          { position: { x: 6, y: 5 }, width: 1, height: 3, type: 'wall' }
        ],
        collectibles: [
          { id: '8-1', position: { x: 4, y: 3 }, type: 'star', value: 1, collected: false },
          { id: '8-2', position: { x: 5, y: 4 }, type: 'star', value: 1, collected: false },
          { id: '8-3', position: { x: 7, y: 3 }, type: 'coin', value: 35, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 4,
        parTime: 20,
        mechanics: ['basic_magnetism', 'precision', 'momentum'],
        hints: ["Use momentum! Pull yourself back first, then slingshot forward through the gaps."]
      },
      {
        id: 9,
        name: "The Magnetic Labyrinth",
        description: "A mind-bending maze that will test everything you've learned",
        world: 1,
        difficulty: 'hard',
        start: { x: 0, y: 0 },
        goal: { x: 9, y: 6 },
        obstacles: [
          { position: { x: 2, y: 1 }, width: 1, height: 2, type: 'wall' },
          { position: { x: 1, y: 3 }, width: 2, height: 1, type: 'wall' },
          { position: { x: 4, y: 2 }, width: 1, height: 3, type: 'wall' },
          { position: { x: 6, y: 1 }, width: 1, height: 2, type: 'wall' },
          { position: { x: 7, y: 4 }, width: 2, height: 1, type: 'wall' },
          { position: { x: 5, y: 5 }, width: 1, height: 2, type: 'wall' }
        ],
        collectibles: [
          { id: '9-1', position: { x: 1, y: 1 }, type: 'star', value: 1, collected: false },
          { id: '9-2', position: { x: 3, y: 4 }, type: 'star', value: 1, collected: false },
          { id: '9-3', position: { x: 6, y: 6 }, type: 'star', value: 1, collected: false },
          { id: '9-4', position: { x: 8, y: 2 }, type: 'coin', value: 40, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 6,
        parTime: 30,
        mechanics: ['basic_magnetism', 'complex_navigation', 'planning'],
        hints: ["The ultimate test! Use everything you've learned - patience, precision, and planning."]
      },
      {
        id: 10,
        name: "Magnetic Grandmaster",
        description: "The final challenge - prove you're a true magnetic master!",
        world: 1,
        difficulty: 'expert',
        start: { x: 1, y: 7 },
        goal: { x: 8, y: 1 },
        obstacles: [
          { position: { x: 3, y: 6 }, width: 1, height: 2, type: 'wall' },
          { position: { x: 2, y: 4 }, width: 2, height: 1, type: 'wall' },
          { position: { x: 5, y: 5 }, width: 1, height: 2, type: 'wall' },
          { position: { x: 6, y: 3 }, width: 2, height: 1, type: 'wall' },
          { position: { x: 4, y: 1 }, width: 1, height: 2, type: 'wall' },
          { position: { x: 7, y: 6 }, width: 1, height: 1, type: 'wall' }
        ],
        collectibles: [
          { id: '10-1', position: { x: 2, y: 6 }, type: 'star', value: 1, collected: false },
          { id: '10-2', position: { x: 4, y: 4 }, type: 'star', value: 1, collected: false },
          { id: '10-3', position: { x: 6, y: 2 }, type: 'star', value: 1, collected: false },
          { id: '10-4', position: { x: 7, y: 5 }, type: 'coin', value: 50, collected: false }
        ],
        gridSize: { width: 10, height: 8 },
        maxPoles: 6,
        parTime: 35,
        mechanics: ['basic_magnetism', 'expert_navigation', 'optimization'],
        hints: ["The ultimate challenge! Every pole placement matters. Think like a magnetic master!"]
      }
    ]
  }
];

export const TOTAL_LEVELS = WORLDS.reduce((total, world) => total + world.levels.length, 0);