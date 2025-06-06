import React, { useEffect, useRef, useState } from "react";

const RunnerGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 400;

    let player = { x: 50, y: 300, width: 50, height: 50, dy: 0, gravity: 1.5, jumpPower: -20 };
    let obstacles = [];
    let frames = 0;

    const jump = () => {
      if (player.y === 300) {
        player.dy = player.jumpPower;
      }
    };

    const generateObstacle = () => {
      const size = 50;
      obstacles.push({ x: canvas.width, y: 300, width: size, height: size });
    };

    const update = () => {
      frames++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#f4e2d8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pharaoh theme elements (pyramids, desert)
      ctx.fillStyle = "#d4af37";
      ctx.fillRect(0, 350, canvas.width, 50); // ground
      ctx.fillStyle = "#c2b280";
      ctx.beginPath();
      ctx.moveTo(200, 350);
      ctx.lineTo(250, 250);
      ctx.lineTo(300, 350);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(500, 350);
      ctx.lineTo(550, 250);
      ctx.lineTo(600, 350);
      ctx.fill();

      // Player
      player.y += player.dy;
      player.dy += player.gravity;
      if (player.y > 300) player.y = 300;
      ctx.fillStyle = "#000";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Obstacles
      ctx.fillStyle = "#8b0000";
      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= 5;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Collision check
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          setIsGameOver(true);
        }
      }

      // Remove off-screen obstacles
      obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

      // Add new obstacle
      if (frames % 100 === 0) {
        generateObstacle();
        setScore(prev => prev + 1);
      }

      if (!isGameOver) requestAnimationFrame(update);
    };

    document.addEventListener("keydown", jump);
    update();

    return () => {
      document.removeEventListener("keydown", jump);
    };
  }, [isGameOver]);

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h1>Pharaoh Runner X</h1>
      <canvas ref={canvasRef} style={{ border: '1px solid #d4af37', background: '#fff3cd' }} />
      <div>Score: {score}</div>
      {isGameOver && <div style={{ color: 'red', fontWeight: 'bold' }}>Game Over!</div>}
    </div>
  );
};

export default RunnerGame;
