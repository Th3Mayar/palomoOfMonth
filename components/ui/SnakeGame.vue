<template>
  <div class="snake-game-wrapper flex flex-col items-end gap-3">
    <Button
      as="button"
      variant="secondary"
      @click.prevent="navigateTo('/winners')"
      class="text-end justify-end select-none"
    >
      <ArrowLeft class="mr-2 h-4 w-4" />
      Back
    </Button>
    <Card class="w-full h-full flex flex-col items-center justify-center relative">
      <CardContent class="flex flex-col items-center w-full h-full">
        <canvas ref="canvasRef" class="snake-canvas"></canvas>
        <div class="score">Score: {{ score }}<br />Max: {{ maxScore }}</div>
        <div v-if="paused" class="paused-overlay">
          <div class="paused-text">PAUSED</div>
          <div class="paused-hint">Press Space, Enter or Esc to resume</div>
        </div>
      </CardContent>
    </Card>
    <Dialog :open="gameOver" @update:open="onDialogOpen">
      <DialogContent class="max-w-xs">
        <DialogHeader>
          <template #title>Game Over</template>
          <template #description>
            <div class="flex flex-col items-center p-5 !justify-start !text-start">
              <p class="flex gap-2 text-xl">
                <Tally3 /> Your score: <b>{{ score }}</b>
              </p>
              <p class="flex gap-2 text-xl">
                <Tally5 /> Max score: <b class="text-buttonSuccess">{{ maxScore }}</b>
              </p>
            </div>
          </template>
        </DialogHeader>
        <DialogFooter>
          <Button as="button" variant="success" @click="playAgain">Play Again</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from "vue";
import { EmployeeService } from "~/services/employee/employeeService";

import Button from "./Button.vue";
import Card from "./Card.vue";
import CardContent from "./CardContent.vue";
import Dialog from "./Dialog.vue";
import DialogContent from "./DialogContent.vue";
import DialogHeader from "./DialogHeader.vue";
import DialogFooter from "./DialogFooter.vue";
import { ArrowLeft, Tally3, Tally5 } from "lucide-vue-next";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const score = ref(0);
const maxScore = ref(0);
const gameOver = ref(false);

// Game settings
const width = 700;
const height = 700;
const grid = 20;
const snakeColor = "#10FB06";
const paused = ref(false);

let ctx: CanvasRenderingContext2D | null = null;
let intervalId: any = null;

// Snake state
let snake = [{ x: 8, y: 12 }];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 15, y: 10 };
let growing = false;

function onDialogOpen(val: boolean) {
  if (!val && gameOver.value) {
    playAgain();
  }
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (width / grid)),
    y: Math.floor(Math.random() * (height / grid)),
  };
}

function togglePause() {
  paused.value = !paused.value;
}

function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  // Draw food (apple)
  const foodScale = 1.7;
  const x = food.x * grid + grid / 2;
  const y = food.y * grid + grid / 2;
  const r = (grid / 2 - 2) * foodScale;
  // Apple body
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = '#d62828';
  ctx.fill();
  // Apple shine
  ctx.beginPath();
  ctx.arc(x - r/3, y - r/3, r/3, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff3';
  ctx.fill();
  // Apple stem
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x, y - r - 8);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#784421';
  ctx.stroke();
  // Apple leaf
  ctx.beginPath();
  ctx.ellipse(x - 7, y - r - 4, 7, 3, Math.PI / 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#43a047';
  ctx.fill();
  ctx.restore();

  // Draw snake
  const headScale = 1.7;
  // Draw body segments
  if (snake.length > 1) {
    // Main body line with smooth curves
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(snake[0].x * grid + grid / 2, snake[0].y * grid + grid / 2);
    for (let i = 1; i < snake.length - 1; i++) {
      const curr = snake[i];
      const next = snake[i + 1];
      const xc = (curr.x * grid + grid / 2 + next.x * grid + grid / 2) / 2;
      const yc = (curr.y * grid + grid / 2 + next.y * grid + grid / 2) / 2;
      ctx.quadraticCurveTo(
        curr.x * grid + grid / 2,
        curr.y * grid + grid / 2,
        xc,
        yc
      );
    }
    // Last segment as straight line
    ctx.lineTo(
      snake[snake.length - 1].x * grid + grid / 2,
      snake[snake.length - 1].y * grid + grid / 2
    );
    ctx.strokeStyle = snakeColor;
    ctx.lineWidth = grid - 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // Draw red stripes (soft arcs with opacity)
    ctx.save();
    for (let i = 1; i < snake.length; i++) {
      const prev = snake[i - 1];
      const curr = snake[i];
      const x1 = prev.x * grid + grid / 2;
      const y1 = prev.y * grid + grid / 2;
      const x2 = curr.x * grid + grid / 2;
      const y2 = curr.y * grid + grid / 2;
      // Calculate arc center and radius
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);
      const arcRadius = grid * 0.45;
      // Alternate arc direction for pattern
      const arcStart = angle + ((i % 2 === 0) ? Math.PI / 2 : -Math.PI / 2);
      const arcEnd = angle + ((i % 2 === 0) ? Math.PI * 1.5 : -Math.PI * 1.5);
      ctx.beginPath();
      ctx.arc(midX, midY, arcRadius, arcStart, arcEnd, false);
      ctx.strokeStyle = 'rgba(214,40,40,0.35)'; // Red with opacity
      ctx.lineWidth = grid * 0.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    ctx.restore();
  }
  // Draw head with special style
  if (snake.length > 0) {
    const s = snake[0];
    const headX = s.x * grid + grid / 2;
    const headY = s.y * grid + grid / 2;
    const headR = (grid / 2 - 2) * headScale;
   
    // Forked tongue
    ctx.save();
    ctx.beginPath();
    let tongueLen = headR * 0.8;
    let tongueWidth = 4;
    let forkGap = 7;
    let tx = headX, ty = headY;
    let dx = direction.x, dy = direction.y;
    if (dx === 0 && dy === -1) { // up
      ctx.moveTo(tx, ty - headR);
      ctx.lineTo(tx - tongueWidth, ty - headR - tongueLen + forkGap);
      ctx.lineTo(tx, ty - headR - tongueLen);
      ctx.lineTo(tx + tongueWidth, ty - headR - tongueLen + forkGap);
      ctx.lineTo(tx, ty - headR);
    } else if (dx === 0 && dy === 1) { // down
      ctx.moveTo(tx, ty + headR);
      ctx.lineTo(tx - tongueWidth, ty + headR + tongueLen - forkGap);
      ctx.lineTo(tx, ty + headR + tongueLen);
      ctx.lineTo(tx + tongueWidth, ty + headR + tongueLen - forkGap);
      ctx.lineTo(tx, ty + headR);
    } else if (dx === 1 && dy === 0) { // right
      ctx.moveTo(tx + headR, ty);
      ctx.lineTo(tx + headR + tongueLen - forkGap, ty - tongueWidth);
      ctx.lineTo(tx + headR + tongueLen, ty);
      ctx.lineTo(tx + headR + tongueLen - forkGap, ty + tongueWidth);
      ctx.lineTo(tx + headR, ty);
    } else if (dx === -1 && dy === 0) { // left
      ctx.moveTo(tx - headR, ty);
      ctx.lineTo(tx - headR - tongueLen + forkGap, ty - tongueWidth);
      ctx.lineTo(tx - headR - tongueLen, ty);
      ctx.lineTo(tx - headR - tongueLen + forkGap, ty + tongueWidth);
      ctx.lineTo(tx - headR, ty);
    }
    
    ctx.restore();
    // Snake face (cute)
    ctx.save();
    ctx.beginPath();
    ctx.arc(headX, headY, headR, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = snakeColor;
    ctx.fill();
    // Eyes
    let eyeOffsetX = headR * 0.5;
    let eyeOffsetY = headR * 0.3;
    let eyeR = headR * 0.22;
    // Position eyes based on direction
    let ex1 = headX - eyeOffsetX * (direction.x === 0 ? 1 : 0.7);
    let ex2 = headX + eyeOffsetX * (direction.x === 0 ? 1 : 0.7);
    let ey = headY - eyeOffsetY * (direction.y === 0 ? 1 : 0.7);
    ctx.beginPath();
    ctx.arc(ex1, ey, eyeR, 0, 2 * Math.PI);
    ctx.arc(ex2, ey, eyeR, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    // Pupils
    let pupilR = eyeR * 0.5;
    ctx.beginPath();
    ctx.arc(ex1, ey, pupilR, 0, 2 * Math.PI);
    ctx.arc(ex2, ey, pupilR, 0, 2 * Math.PI);
    ctx.fillStyle = '#222';
    ctx.fill();
    // Smile
    let smileY = headY + headR * 0.35;
    ctx.beginPath();
    ctx.arc(headX, smileY, headR * 0.35, Math.PI * 0.15, Math.PI * 0.85);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }
}

function resetGame() {
  snake = [{ x: 8, y: 12 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  food = randomFood();
  score.value = 0;
  gameOver.value = false;
}

function setMaxScore(newScore: number) {
  if (newScore > maxScore.value) {
    maxScore.value = newScore;
    localStorage.setItem("snake-max-score", String(newScore));
  }
}

function handleGameOver() {
  setMaxScore(score.value);
  gameOver.value = true;
  if (intervalId) clearInterval(intervalId);
}

function update() {
  // Move snake
  direction = { ...nextDirection };
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wall collision
  if (head.x < 0 || head.x >= width / grid || head.y < 0 || head.y >= height / grid) {
    handleGameOver();
    return;
  }
  // Self collision
  if (snake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y)) {
    handleGameOver();
    return;
  }

  snake.unshift(head);
  // Food collision
  if (head.x === food.x && head.y === food.y) {
    score.value++;
    food = randomFood();
    growing = true;
  }
  if (!growing) {
    snake.pop();
  } else {
    growing = false;
  }
}

function loop() {
  if (!paused.value) {
    update();
    draw();
  }
}

function handleKey(e: KeyboardEvent) {
  if (e.key === " " || e.key === "Escape" || e.key === "Enter") {
    togglePause();
    return;
  }
  if (paused.value) return;
  if (e.key === "ArrowUp" && direction.y !== 1) nextDirection = { x: 0, y: -1 };
  else if (e.key === "ArrowDown" && direction.y !== -1) nextDirection = { x: 0, y: 1 };
  else if (e.key === "ArrowLeft" && direction.x !== 1) nextDirection = { x: -1, y: 0 };
  else if (e.key === "ArrowRight" && direction.x !== -1) nextDirection = { x: 1, y: 0 };
}

// Get current user from cookie
function getCurrentUser() {
  if (process.client) {
    try {
      const userCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user-data="))
        ?.split("=")[1];
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie));
        return userData;
      }
    } catch (error) {
      console.warn("Error parsing user cookie:", error);
    }
  }
  return null;
}

onMounted(() => {
  // Load max score from storage
  const stored = localStorage.getItem("snake-max-score");
  if (stored) maxScore.value = Number(stored);

  if (canvasRef.value) {
    canvasRef.value.width = width;
    canvasRef.value.height = height;
    ctx = canvasRef.value.getContext("2d");
    document.addEventListener("keydown", handleKey);
    resetGame();
    draw();
    intervalId = setInterval(loop, 120);
  }
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
  document.removeEventListener("keydown", handleKey);
});

function playAgain() {
  resetGame();
  draw();
  paused.value = false;
  intervalId = setInterval(loop, 120);
}
</script>

<style scoped>
.snake-game-wrapper {
  position: relative;
  width: 48em;
  height: 48em;
  margin-top: 1rem;
}

.snake-canvas {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1rem;
  display: block;
}

.score {
  position: absolute;
  top: 10px;
  left: 20px;
  color: #fff;
  font-size: 1.2rem;
  text-shadow: 0 0 8px #10fb06, 0 0 12px #1b71d9;
  font-family: "Press Start 2P", cursive;
}

.paused-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: 10;
}
.paused-text {
  color: #FFD700;
  font-size: 2.5rem;
  font-family: 'Press Start 2P', cursive;
  text-shadow: 0 0 12px #1B71D9, 0 0 24px #FFD700;
  margin-bottom: 1rem;
}
.paused-hint {
  color: #fff;
  font-size: 1.1rem;
  font-family: 'Press Start 2P', cursive;
  opacity: 0.8;
}
</style>
