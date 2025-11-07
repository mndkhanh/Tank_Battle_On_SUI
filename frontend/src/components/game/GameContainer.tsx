import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { gameConfig } from "./GameEngine";

const GameContainer: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(gameConfig);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="game-container bg-game-bg p-4 rounded-lg flex justify-center items-center">
      <div id="phaser-game" className="mx-auto"></div>
    </div>
  );
};

export default GameContainer;
