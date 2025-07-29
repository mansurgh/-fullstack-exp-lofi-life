import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface TetrisGameProps {
  className?: string;
}

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

const TETROMINO_SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
};

const TETROMINO_COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000'
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

export const TetrisGame = ({ className = '' }: TetrisGameProps) => {
  const [board, setBoard] = useState<string[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const createTetromino = useCallback((): Tetromino => {
    const types = Object.keys(TETROMINO_SHAPES) as TetrominoType[];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      type,
      shape: TETROMINO_SHAPES[type],
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINO_SHAPES[type][0].length / 2),
      y: 0,
      color: TETROMINO_COLORS[type]
    };
  }, []);

  const isValidMove = useCallback((piece: Tetromino, dx: number, dy: number): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  const rotatePiece = useCallback((piece: Tetromino): Tetromino => {
    const rotated = piece.shape[0].map((_, i) => 
      piece.shape.map(row => row[i]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const placePiece = useCallback((piece: Tetromino) => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          if (piece.y + y >= 0) {
            newBoard[piece.y + y][piece.x + x] = piece.color;
          }
        }
      }
    }
    
    setBoard(newBoard);
    
    // Check for completed lines
    const completedLines = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every(cell => cell !== '')) {
        completedLines.push(y);
      }
    }
    
    if (completedLines.length > 0) {
      // Remove completed lines
      const clearedBoard = newBoard.filter((_, y) => !completedLines.includes(y));
      // Add empty lines at the top
      const emptyLines = Array(completedLines.length).fill(null).map(() => Array(BOARD_WIDTH).fill(''));
      setBoard([...emptyLines, ...clearedBoard]);
      
      // Update score and lines
      const pointsMap = [0, 40, 100, 300, 1200];
      setScore(prev => prev + pointsMap[completedLines.length] * level);
      setLines(prev => prev + completedLines.length);
      setLevel(prev => Math.floor((lines + completedLines.length) / 10) + 1);
    }
  }, [board, level, lines]);

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || isPaused) return;
    
    if (isValidMove(currentPiece, dx, dy)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + dx, y: prev.y + dy } : null);
    } else if (dy > 0) {
      // Piece can't move down, place it
      placePiece(currentPiece);
      const newPiece = createTetromino();
      
      if (!isValidMove(newPiece, 0, 0)) {
        setGameOver(true);
      } else {
        setCurrentPiece(newPiece);
      }
    }
  }, [currentPiece, gameOver, isPaused, isValidMove, placePiece, createTetromino]);

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const rotated = rotatePiece(currentPiece);
    if (isValidMove(rotated, 0, 0)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, gameOver, isPaused, rotatePiece, isValidMove]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    let dy = 1;
    while (isValidMove(currentPiece, 0, dy)) {
      dy++;
    }
    movePiece(0, dy - 1);
  }, [currentPiece, gameOver, isPaused, isValidMove, movePiece]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key.toLowerCase()) {
        case 'w':
          rotatePieceHandler();
          break;
        case 'a':
          movePiece(-1, 0);
          break;
        case 's':
          movePiece(0, 1);
          break;
        case 'd':
          movePiece(1, 0);
          break;
        case ' ':
          dropPiece();
          break;
        case 'p':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotatePieceHandler, dropPiece, gameOver]);

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      setCurrentPiece(createTetromino());
    }
  }, [currentPiece, gameOver, createTetromino]);

  useEffect(() => {
    if (gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    const dropSpeed = Math.max(50, 500 - (level - 1) * 50);
    gameLoopRef.current = setInterval(() => {
      movePiece(0, 1);
    }, dropSpeed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [level, gameOver, isPaused, movePiece]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] && currentPiece.y + y >= 0) {
            displayBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
          }
        }
      }
    }
    
    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className="w-6 h-6 border border-gray-600 text-xs flex items-center justify-center"
            style={{ backgroundColor: cell || '#1a1a1a' }}
          />
        ))}
      </div>
    ));
  };

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('')));
    setCurrentPiece(null);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
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
            <div className="font-bold text-primary">Lines</div>
            <div className="text-xl">{lines}</div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-4">
        <div className="border-2 border-primary rounded bg-gray-900 p-2">
          {renderBoard()}
        </div>
      </div>

      {/* Controls */}
      <div className="text-center text-xs text-muted-foreground">
        <div className="mb-2">
          <span className="font-bold">Controls:</span> W (rotate) • A/D (move) • S (down) • Space (drop) • P (pause)
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
      </div>
    </Card>
  );
};