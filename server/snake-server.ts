import { Server } from 'socket.io'
import { createServer } from 'http'

const PORT = 3001
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

// Define the player structure
interface Player {
  id: string
  socketId?: string
  snake: { x: number; y: number }[]
  direction: { x: number; y: number }
  nextDirection: { x: number; y: number }
  score: number
  alive: boolean
  [key: string]: any
}
let players: { [id: string]: Player } = {}
let food = { x: 15, y: 10 }

function randomFood(width = 40, height = 30) {
  return {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
  }
}

io.on('connection', (socket) => {
  // Send the initial game state to the newly connected player
  socket.emit('game-state', { players, food })

  socket.on('player-join', (data) => {
    players[data.id] = {
      ...data,
      socketId: socket.id,
      snake: [{ x: 8, y: 12 }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      score: 0,
      alive: true,
    }
    io.emit('game-state', { players, food })
  })

  socket.on('player-move', ({ id, direction }) => {
    if (players[id]) {
      players[id].nextDirection = direction
    }
  })

  socket.on('disconnect', () => {
    // Delete the player who disconnects
    Object.keys(players).forEach((id) => {
      if (players[id].socketId === socket.id) {
        delete players[id]
      }
    })
    io.emit('game-state', { players, food })
  })
})

// Game loop
setInterval(() => {
  // Update each player
  Object.values(players).forEach((player) => {
    if (!player.alive) return
    player.direction = { ...player.nextDirection }
    const head = {
      x: player.snake[0].x + player.direction.x,
      y: player.snake[0].y + player.direction.y,
    }
    // Collision with walls
    if (head.x < 0 || head.x >= 40 || head.y < 0 || head.y >= 30) {
      player.alive = false
      return
    }
    // Collision with itself
    if (player.snake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y)) {
      player.alive = false
      return
    }
    // Collision with other players
    Object.values(players).forEach((other) => {
      if (other.id !== player.id) {
        if (other.snake.some((s) => s.x === head.x && s.y === head.y)) {
          player.alive = false
        }
      }
    })
    player.snake.unshift(head)
    // Check if the snake eats food
    if (head.x === food.x && head.y === food.y) {
      player.score++
      food = randomFood(40, 30)
    }
    if (player.snake.length > 1 && !(head.x === food.x && head.y === food.y)) {
      player.snake.pop()
    }
  })
  io.emit('game-state', { players, food })
}, 120)

httpServer.listen(PORT, () => {
  console.log(`SnakeGame server running on http://localhost:${PORT}`)
})
