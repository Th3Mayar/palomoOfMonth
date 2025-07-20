<template>
    <div class="snake-game-wrapper flex flex-col items-end gap-3">
        <Button as="button" variant="secondary" @click.prevent="navigateTo('/winners')"
            class="text-end justify-end select-none">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Back
        </Button>
        <Card class="w-full h-full flex flex-col items-center justify-center relative">
            <CardContent class="flex flex-col items-center w-full h-full">
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
const width = 700
const height = 700
const grid = 20
const snakeColor = '#10FB06'
const foodColor = '#FFD700'

let ctx: CanvasRenderingContext2D | null = null
let intervalId: any = null

// Snake state
let snake = [{ x: 8, y: 12 }]
let direction = { x: 1, y: 0 }
let nextDirection = { x: 1, y: 0 }
let food = { x: 15, y: 10 }
let growing = false

function randomFood() {
    return {
        x: Math.floor(Math.random() * (width / grid)),
        y: Math.floor(Math.random() * (height / grid)),
    }
}

function draw() {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)

    // Draw food
    const foodScale = 1.7
    ctx.fillStyle = foodColor
    ctx.beginPath()
    ctx.arc(
        food.x * grid + grid / 2,
        food.y * grid + grid / 2,
        (grid / 2 - 2) * foodScale,
        0, 2 * Math.PI
    )
    ctx.fill()

    // Draw snake
    const headScale = 1.7
    for (let i = 0; i < snake.length; i++) {
        const s = snake[i]
        if (i === 0 && employeeImageObj.value && employeeImageLoaded.value) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(
                s.x * grid + grid / 2,
                s.y * grid + grid / 2,
                (grid / 2 - 2) * headScale,
                0, 2 * Math.PI
            )
            ctx.closePath()
            ctx.clip()
            ctx.drawImage(
                employeeImageObj.value,
                s.x * grid + (2 - (grid * (headScale - 1) / 2)),
                s.y * grid + (2 - (grid * (headScale - 1) / 2)),
                (grid - 4) * headScale,
                (grid - 4) * headScale
            )
            ctx.restore()
        } else if (i === 0) {
            ctx.fillStyle = snakeColor
            ctx.beginPath()
            ctx.arc(
                s.x * grid + grid / 2,
                s.y * grid + grid / 2,
                (grid / 2 - 2) * headScale,
                0, 2 * Math.PI
            )
            ctx.fill()
        } else {
            ctx.fillStyle = snakeColor
            ctx.beginPath()
            ctx.arc(s.x * grid + grid / 2, s.y * grid + grid / 2, grid / 2 - 2, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
}

function resetGame() {
    snake = [{ x: 8, y: 12 }]
    direction = { x: 1, y: 0 }
    nextDirection = { x: 1, y: 0 }
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
    setMaxScore(score.value)
    gameOver.value = true
    if (intervalId) clearInterval(intervalId)
}

function update() {
    // Move snake
    direction = { ...nextDirection }
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

    // Wall collision
    if (head.x < 0 || head.x >= width / grid || head.y < 0 || head.y >= height / grid) {
        handleGameOver()
        return
    }
    // Self collision
    if (snake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y)) {
        handleGameOver()
        return
    }

    snake.unshift(head)
    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score.value++
        food = randomFood()
        growing = true
    }
    if (!growing) {
        snake.pop()
    } else {
        growing = false
    }
}

function loop() {
    update()
    draw()
}

function handleKey(e: KeyboardEvent) {
    if (e.key === 'ArrowUp' && direction.y !== 1) nextDirection = { x: 0, y: -1 }
    else if (e.key === 'ArrowDown' && direction.y !== -1) nextDirection = { x: 0, y: 1 }
    else if (e.key === 'ArrowLeft' && direction.x !== 1) nextDirection = { x: -1, y: 0 }
    else if (e.key === 'ArrowRight' && direction.x !== -1) nextDirection = { x: 1, y: 0 }
}

// Obtener usuario actual desde cookie
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
        // Cargar imagen con fallback
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
    text-shadow: 0 0 8px #10FB06, 0 0 12px #1B71D9;
    font-family: 'Press Start 2P', cursive;
}
</style>
