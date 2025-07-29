import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface RaceGameProps {
  className?: string;
}

interface Obstacle {
  id: number;
  lane: number;
  y: number;
}

interface Car {
  lane: number;
}

const LANE_COUNT = 3;
const GAME_HEIGHT = 400;
const OBSTACLE_HEIGHT = 40;
const CAR_HEIGHT = 60;
const OBSTACLE_SPEED = 2;
const LEVEL_DURATION = 60; // 1 minute per level

export const RaceGame = ({ className = '' }: RaceGameProps) => {
  const [car, setCar] = useState<Car>({ lane: 1 }); // Start in middle lane
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(LEVEL_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleIdRef = useRef(0);

  const moveCar = useCallback((direction: 'left' | 'right') => {
    if (gameOver || isPaused) return;
    
    setCar(prev => {
      if (direction === 'left' && prev.lane > 0) {
        return { lane: prev.lane - 1 };
      }
      if (direction === 'right' && prev.lane < LANE_COUNT - 1) {
        return { lane: prev.lane + 1 };
      }
      return prev;
    });
  }, [gameOver, isPaused]);

  const createObstacle = useCallback((): Obstacle => {
    return {
      id: obstacleIdRef.current++,
      lane: Math.floor(Math.random() * LANE_COUNT),
      y: -OBSTACLE_HEIGHT
    };
  }, []);

  const checkCollision = useCallback((car: Car, obstacles: Obstacle[]): boolean => {
    const carY = GAME_HEIGHT - CAR_HEIGHT - 20; // Car position from bottom
    
    return obstacles.some(obstacle => {
      return obstacle.lane === car.lane && 
             obstacle.y <= carY + CAR_HEIGHT && 
             obstacle.y + OBSTACLE_HEIGHT >= carY;
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key.toLowerCase()) {
        case 'a':
          moveCar('left');
          break;
        case 'd':
          moveCar('right');
          break;
        case 'p':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveCar, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      // Move obstacles down
      setObstacles(prev => {
        const moved = prev.map(obstacle => ({
          ...obstacle,
          y: obstacle.y + OBSTACLE_SPEED + level
        }));
        
        // Remove obstacles that are off screen
        const filtered = moved.filter(obstacle => obstacle.y < GAME_HEIGHT);
        
        // Add score for passed obstacles
        const passedCount = prev.length - filtered.length;
        if (passedCount > 0) {
          setScore(current => current + passedCount * 10 * level);
        }
        
        // Check collision
        if (checkCollision(car, filtered)) {
          setGameOver(true);
          return filtered;
        }
        
        // Add new obstacles randomly
        if (Math.random() < 0.03 + level * 0.01) {
          return [...filtered, createObstacle()];
        }
        
        return filtered;
      });

      // Update timer
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Level complete
          setLevel(current => current + 1);
          setScore(current => current + 1000); // Bonus for completing level
          return LEVEL_DURATION;
        }
        return prev - 1;
      });
    }, 50);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [level, gameOver, isPaused, car, checkCollision, createObstacle]);

  const resetGame = () => {
    setCar({ lane: 1 });
    setObstacles([]);
    setScore(0);
    setLevel(1);
    setTimeLeft(LEVEL_DURATION);
    setGameOver(false);
    setIsPaused(false);
    obstacleIdRef.current = 0;
  };

  const getLaneX = (lane: number) => {
    const laneWidth = 100 / LANE_COUNT;
    return lane * laneWidth + laneWidth / 2;
  };

  return (
    <Card className={`p-4 bg-background/90 backdrop-blur-sm ${className}`}>
      {/* Scoreboard */}
      <div className="mb-4 text-center">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-bold text-primary">Score</div>
            <div className="text-xl">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="font-bold text-primary">Level</div>
            <div className="text-xl">{level}</div>
          </div>
          <div>
            <div className="font-bold text-primary">Time</div>
            <div className="text-xl">{timeLeft}s</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex justify-center mb-4">
        <div 
          className="relative border-2 border-primary rounded bg-gray-800 overflow-hidden"
          style={{ width: '300px', height: `${GAME_HEIGHT}px` }}
        >
          {/* Road lanes */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: LANE_COUNT }, (_, i) => (
              <div key={i} className="flex-1 border-r border-yellow-400 last:border-r-0">
                {/* Lane dividers */}
                <div className="w-full h-full relative">
                  {Array.from({ length: 10 }, (_, j) => (
                    <div 
                      key={j}
                      className="absolute w-1 h-8 bg-white left-1/2 transform -translate-x-1/2"
                      style={{ top: `${j * 40}px` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Car */}
          <div
            className="absolute bg-blue-500 rounded transition-all duration-150"
            style={{
              width: '40px',
              height: `${CAR_HEIGHT}px`,
              left: `${getLaneX(car.lane)}%`,
              transform: 'translateX(-50%)',
              bottom: '20px'
            }}
          >
            <div className="w-full h-full bg-blue-500 rounded-lg border-2 border-blue-300"></div>
          </div>

          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className="absolute bg-red-500 rounded"
              style={{
                width: '40px',
                height: `${OBSTACLE_HEIGHT}px`,
                left: `${getLaneX(obstacle.lane)}%`,
                transform: 'translateX(-50%)',
                top: `${obstacle.y}px`
              }}
            >
              <div className="w-full h-full bg-red-500 rounded border-2 border-red-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="text-center text-xs text-muted-foreground">
        <div className="mb-2">
          <span className="font-bold">Controls:</span> A (left) • D (right) • P (pause)
        </div>
        
        {gameOver && (
          <div className="mb-2">
            <div className="text-red-500 font-bold mb-2">Game Over!</div>
            <button 
              onClick={resetGame}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"
            >
              Play Again
            </button>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="text-yellow-500 font-bold">Paused - Press P to continue</div>
        )}

        <div className="mt-2 text-xs">
          Survive for 60 seconds to reach the next level!
        </div>
      </div>
    </Card>
  );
};