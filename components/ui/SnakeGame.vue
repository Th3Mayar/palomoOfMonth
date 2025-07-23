<template>
    <div class="snake-game-wrapper flex flex-col items-end gap-3">
        <Button as="button" variant="secondary" @click.prevent="navigateTo('/winners')"
            class="text-end justify-end select-none">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Back
        </Button>
        <Card class="w-full h-full flex flex-col items-center justify-center relative !bg-transparent">
            <CardContent class="flex flex-col items-center w-full h-full !p-0 !pt-0">
                <canvas ref="canvasRef" class="snake-canvas"></canvas>
                <div class="score">Score: {{ score }}<br />Max: {{ maxScore }}</div>
            </CardContent>
        </Card>
        <Dialog :open="gameOver" @update:open="onDialogOpen">
            <DialogContent class="max-w-xs">
                <DialogHeader>
                    <template #title>Game Over</template>
                    <template #description>
                        <div class="flex flex-col items-center p-5 !justify-start !text-start">
                            <p class="flex gap-2 text-xl"><Tally3 /> Your score: <b>{{ score }}</b></p>
                            <p class="flex gap-2 text-xl"><Tally5 /> Max score: <b class="text-buttonSuccess">{{ maxScore }}</b></p>
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
function onDialogOpen(val: boolean) {
    if (!val && gameOver.value) {
        playAgain()
    }
}
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue'
import { EmployeeService } from '~/services/employee/employeeService'
import { io, Socket } from 'socket.io-client'

import Button from './Button.vue'
import Card from './Card.vue'
import CardContent from './CardContent.vue'
import Dialog from './Dialog.vue'
import DialogContent from './DialogContent.vue'
import DialogHeader from './DialogHeader.vue'
import DialogFooter from './DialogFooter.vue'
import { ArrowLeft, Tally3, Tally5 } from 'lucide-vue-next'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const maxScore = ref(0)
const gameOver = ref(false)

// Game settings
const width = 1000 // New larger size
const height = 900 // New larger size
const grid = 30    // Grid for better gameplay
const snakeColor = '#10FB06'
const foodColor = '#FFD700'

let ctx: CanvasRenderingContext2D | null = null
let intervalId: any = null
let socket: Socket | null = null

// Multiplayer player structure
type Player = {
  id: string
  name: string
  color: string
  snake: Array<{ x: number, y: number }>
  direction: { x: number, y: number }
  nextDirection: { x: number, y: number }
  score: number
  alive: boolean
}

// Global game state
let playerId = ''
let players: Record<string, Player> = {}
let food = { x: 15, y: 10 }
let growing = false

// Player colors for multiplayer
const playerColors = [
  '#10FB06', '#FFD700', '#1B71D9', '#FF5733', '#8E44AD', '#00BFFF', '#FF1493', '#FF8C00'
]

function createPlayer(id: string, name: string, color: string) {
  return {
    id,
    name,
    color,
    snake: [{ x: 8, y: 12 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    alive: true
  }
}

function randomFood() {
    // Margin to avoid apple on the edge
    const margin = 1;
    const maxX = Math.floor(width / grid) - margin - 1;
    const maxY = Math.floor(height / grid) - margin - 1;
    const min = margin;
    return {
        x: Math.floor(Math.random() * (maxX - min + 1)) + min,
        y: Math.floor(Math.random() * (maxY - min + 1)) + min,
    }
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  // Draw the food as an apple
  const headScale = 1.1 // Smaller head
  const bodyScale = 0.7 // Smaller body
  const foodScale = headScale // Food same size as head
  ctx.save()
  // Apple body
  ctx.beginPath()
  ctx.arc(
    food.x * grid + grid / 2,
    food.y * grid + grid / 2,
    (grid / 2 - 2) * foodScale,
    0, 2 * Math.PI
  )
  ctx.fillStyle = '#d62828' // Apple red
  ctx.fill()
  // Apple stem
  ctx.beginPath()
  ctx.moveTo(food.x * grid + grid / 2, food.y * grid + grid / 2 - (grid / 2 - 2) * foodScale)
  ctx.lineTo(food.x * grid + grid / 2, food.y * grid + grid / 2 - (grid / 2 - 2) * foodScale - 8)
  ctx.strokeStyle = '#7f5539'
  ctx.lineWidth = 2
  ctx.stroke()
  // Apple leaf
  ctx.beginPath()
  ctx.ellipse(
    food.x * grid + grid / 2 + 6,
    food.y * grid + grid / 2 - (grid / 2 - 2) * foodScale - 6,
    5, 2.5, Math.PI / 4, 0, 2 * Math.PI
  )
  ctx.fillStyle = '#43aa8b'
  ctx.fill()
  ctx.restore()

  // Draw all players' snakes
  Object.values(players).forEach((player) => {
    if (!player.alive) return
    for (let i = 0; i < player.snake.length; i++) {
      const s = player.snake[i]
      // Highlight local player with a thicker border
      if (player.id === playerId && i === 0) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(
          s.x * grid + grid / 2,
          s.y * grid + grid / 2,
          (grid / 2 - 2) * headScale + 3,
          0, 2 * Math.PI
        )
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.restore()
      }
      ctx.fillStyle = i === 0 ? player.color : player.color + '99'
      ctx.beginPath()
      ctx.arc(
        s.x * grid + grid / 2,
        s.y * grid + grid / 2,
        i === 0 ? (grid / 2 - 2) * headScale : (grid / 2 - 2) * bodyScale,
        0, 2 * Math.PI
      )
      ctx.fill()
      // Draw player name above the head
      if (i === 0) {
        ctx.font = player.id === playerId ? 'bold 1.2rem Arial' : 'bold 1rem Arial'
        ctx.fillStyle = player.id === playerId ? '#FFD700' : '#fff'
        ctx.textAlign = 'center'
        ctx.fillText(player.name, s.x * grid + grid / 2, s.y * grid + grid / 2 - 14)
      }
    }
  })
}

function resetGame() {
  // Reset all players
  Object.values(players).forEach((player) => {
    player.snake = [{ x: 8, y: 12 }]
    player.direction = { x: 1, y: 0 }
    player.nextDirection = { x: 1, y: 0 }
    player.score = 0
    player.alive = true
  })
  food = randomFood()
  score.value = 0
  gameOver.value = false
}

function setMaxScore(newScore: number) {
    if (newScore > maxScore.value) {
        maxScore.value = newScore
        localStorage.setItem('snake-max-score', String(newScore))
    }
}

function handleGameOver() {
  // Handle game over for the local player
  const player = players[playerId]
  if (player) {
    setMaxScore(player.score)
    gameOver.value = true
    if (intervalId) clearInterval(intervalId)
  }
}

function update() {
  let localPlayerDied = false
  Object.values(players).forEach((player) => {
    if (!player.alive) return
    player.direction = { ...player.nextDirection }
    const head = {
      x: player.snake[0].x + player.direction.x,
      y: player.snake[0].y + player.direction.y
    }
    // Collision with wall
    if (head.x < 0 || head.x >= width / grid || head.y < 0 || head.y >= height / grid) {
      player.alive = false
      if (player.id === playerId) localPlayerDied = true
      return
    }
    // Collision with self
    if (player.snake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y)) {
      player.alive = false
      if (player.id === playerId) localPlayerDied = true
      return
    }
    // Collision with other players
    Object.values(players).forEach((other) => {
      if (other.id !== player.id) {
        if (other.snake.some((s) => s.x === head.x && s.y === head.y)) {
          player.alive = false
          if (player.id === playerId) localPlayerDied = true
        }
      }
    })
    player.snake.unshift(head)
    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
      player.score++
      if (player.id === playerId) {
        score.value = player.score
      }
      food = randomFood()
      growing = true
    }
    if (!growing) {
      player.snake.pop()
    } else {
      growing = false
    }
  })
  // If the local player died, handle game over
  if (localPlayerDied) handleGameOver()
}

function loop() {
    update()
    draw()
}

function handleKey(e: KeyboardEvent) {
  // No action if game is over
  const player = players[playerId]
  if (!player) return
  if (e.key === 'ArrowUp' && player.direction.y !== 1) player.nextDirection = { x: 0, y: -1 }
  else if (e.key === 'ArrowDown' && player.direction.y !== -1) player.nextDirection = { x: 0, y: 1 }
  else if (e.key === 'ArrowLeft' && player.direction.x !== 1) player.nextDirection = { x: -1, y: 0 }
  else if (e.key === 'ArrowRight' && player.direction.x !== -1) player.nextDirection = { x: 1, y: 0 }
  // Emit player move to server
  socket?.emit('player-move', {
    id: playerId,
    direction: player.nextDirection
  })
}

// Function to get the current user from cookies
function getCurrentUser() {
  if (process.client) {
    try {
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-data='))
        ?.split('=')[1]
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie))
        return userData
      }
    } catch (error) {
      console.warn('Error parsing user cookie:', error)
    }
  }
  return null
}

const employees = ref<any[]>([])
const employeeImage = ref<string | null>(null)
const employeeImageObj = ref<HTMLImageElement | null>(null)
const employeeImageLoaded = ref(false)

async function fetchEmployeesAndSetImage() {
  try {
    const employeeService = EmployeeService.getInstance()
    employees.value = await employeeService.getAllEmployees()

    const currentUser = getCurrentUser()

    if (currentUser && currentUser.id_employee) {
      const found = employees.value.find(e => e.id === currentUser.id_employee)

      if (found && found.image) {
        employeeImage.value = found.image
        // Create a new Image object to preload the image
        const img = new window.Image()
        img.onload = () => { employeeImageLoaded.value = true }
        img.onerror = () => { employeeImageLoaded.value = false }
        img.src = found.image
        employeeImageObj.value = img
      } else {
        employeeImageLoaded.value = false
      }
    } else {
      employeeImageLoaded.value = false
    }
  } catch (err) {
    employeeImageLoaded.value = false
  }
}

onMounted(() => {
  // Load max score from storage
  const stored = localStorage.getItem('snake-max-score')
  if (stored) maxScore.value = Number(stored)

  // Initialize players
  const currentUser = getCurrentUser()
  if (currentUser) {
    playerId = currentUser.id || currentUser.id_employee || Math.random().toString(36).slice(2)
    const name = currentUser.name || currentUser.username || 'Jugador'
    const color = playerColors[Math.floor(Math.random() * playerColors.length)]
    players[playerId] = createPlayer(playerId, name, color)
  } else {
    // If no user is logged in, create a guest player
    playerId = Math.random().toString(36).slice(2)
    players[playerId] = createPlayer(playerId, 'Invitado', playerColors[0])
  }

  // Socket.io: connect to the server
  socket = io('http://localhost:3001')
  socket.on('connect', () => {
    // Send player data to the server
    socket?.emit('player-join', {
      id: playerId,
      name: players[playerId].name,
      color: players[playerId].color
    })
  })
  // Socket.io: listen for game state updates
  socket.on('game-state', (data: { players: Record<string, Player>, food: any }) => {
    players = data.players
    food = data.food
    draw()
  })
  // Listen for player join/leave events
  socket.on('request-move', () => {
    const player = players[playerId]
    if (player) {
      socket?.emit('player-move', {
        id: playerId,
        direction: player.nextDirection
      })
    }
  })

  if (canvasRef.value) {
    canvasRef.value.width = width
    canvasRef.value.height = height
    ctx = canvasRef.value.getContext('2d')
    document.addEventListener('keydown', handleKey)
    resetGame()
    draw()
    intervalId = setInterval(loop, 120)
  }
})

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
    document.removeEventListener('keydown', handleKey)
})
onBeforeMount(async () => {
    await fetchEmployeesAndSetImage()
})
function playAgain() {
    resetGame()
    draw()
    intervalId = setInterval(loop, 120)
}
</script>

<style scoped>

/* SnakeGame más grande */
.snake-game-wrapper {
    position: relative;
    width: 50em;
    height: 38em;
    margin-top: 1rem;
}

canvas {
    padding: 1rem;
}

.snake-canvas {
    width: 100%;
    height: 100%;
    min-width: 800px;
    min-height: 600px;
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
    text-shadow: 0 0 8px #10FB06, 0 0 12px #1B71D9;
    font-family: 'Press Start 2P', cursive;
}
</style>
