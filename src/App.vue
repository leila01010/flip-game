<script setup>
import { computed, ref, watch } from 'vue'
import { useTimer } from '@/composables/timer.js'
import { shuffle } from '@/modules/utils.js'

import GameBoard from '@/components/GameBoard.vue'
import GameResult from '@/components/GameResult.vue'

import IconMusic from '@/components/icons/IconMusic.vue'
import IconNoMusic from '@/components/icons/IconNoMusic.vue'

import bgAudio from '@/assets/audio/game-bg.mp3?url'
import successAudio from '@/assets/audio/success-sound.mp3'

const { timer, startTimer, stopTimer, initTimer } = useTimer()

const levels = [
  {
    title: 'آسان',
    key: 'easy',
    count: 12,
    time: 3000,
    move: 30
  },
  {
    title: 'معمولی',
    key: 'normal',
    count: 16,
    time: 2000,
    move: 40
  },
  {
    title: 'سخت',
    key: 'hard',
    count: 20,
    time: 2000,
    move: 30
  }
]
const level = ref('normal')
const cards = ref([])
const selections = ref([])
const started = ref(false)
const isPlay = ref(true)
const showModal = ref(false)
const moveCountAllowed = ref(0)

const bgSound = new Audio(bgAudio)
const successSound = new Audio(successAudio)

const selectedLevel = computed(() => {
  return levels.find(item => item.key === level.value)
})

const matchesFound = computed(() => {
  const matchedCards = cards.value.filter(card => card.matched === true).length

  return matchedCards / 2
})

const status = computed(() => {
  if (matchesFound.value && matchesFound.value === cards.value.length / 2) return 'win'
  else if (moveCountAllowed.value === 0 && matchesFound.value !== cards.value.length / 2
    || timer.status === 'end') return 'loose'
  else return ''
})

const isGameOver = computed(() => {
  return status.value === 'win' || status.value === 'loose'
})

const getGridDimension = computed(() => {
  const ROWS = 4
  return {
    rows: ROWS,
    cols: selectedLevel.value.count / ROWS
  }
})

watch(selectedLevel, currentValue => {
  if (currentValue) {
    moveCountAllowed.value = currentValue.move
    createBoard()
    // restartGame()
  }
}, { immediate: true })

watch(isGameOver, currentValue => {
  if (currentValue) {
    pauseSound()
    stopTimer()
    showModal.value = true
  }
})

watch(
  selections,
  currentValue => {
    if (currentValue.length === 2) {
      const selectionOne = currentValue[0]
      const selectionTwo = currentValue[1]

      if (selectionOne.value === selectionTwo.value) {
        cards.value[selectionOne.index].matched = true
        cards.value[selectionTwo.index].matched = true
        successSound.play()
      } else {
        setTimeout(() => {
          cards.value[selectionOne.index].visible = false
          cards.value[selectionTwo.index].visible = false
        }, 1000)
      }

      selections.value.length = 0
    }
  },
  { deep: true }
)

function createBoard() {
  const pairsCount = selectedLevel.value.count / 2
  cards.value = []

  for(let i = 0; i < pairsCount; i++) {
    cards.value.push({
      value: i,
      variant: 1,
      visible: false,
      index: null,
      matched: false
    })
    cards.value.push({
      value: i,
      variant: 1,
      visible: false,
      index: null,
      matched: false
    })
  }

  shuffleCards()
}

function selectCard(card) {
  if (isGameOver.value) return

  cards.value[card.index].visible = true
  moveCountAllowed.value -= 1

  if (selections.value[0]) {
    if (selections.value[0].index === card.index && selections.value[0].value === card.value) {
      return
    } else {
      selections.value[1] = card
    }
  } else {
    selections.value[0] = card
    startGame()
  }
}

function startGame() {
  if (!started.value) {
    startTimer()
    playSound()
  }
  started.value = true
}

function restartGame() {
  cards.value = shuffle(cards.value)
  moveCountAllowed.value = selectedLevel.value.move
  startTimer()

  cards.value = cards.value.map((card, index) => {
    return {
      ...card,
      matched: false,
      index: index,
      visible: false
    }
  })
}

function shuffleCards() {
  cards.value = shuffle(cards.value)

  cards.value = cards.value.map((card, index) => {
    return {
      ...card,
      index: index,
    }
  })
}

function playSound() {
  bgSound.play()
  isPlay.value = true
}

function pauseSound() {
  bgSound.pause()
  isPlay.value = false
}

function toggleSound() {
  if (isPlay.value) pauseSound()
  else playSound()
}

initTimer()
</script>

<template>
  <div class="flip-game">
    <div class="settings">
      <div class="levels">
        <div
          v-for="item in levels"
          :key="item.key"
          class="level-item"
          :class="{ 'is-active' : level === item.key }"
          @click="level = item.key"
        >
          <span v-text="item.title" />
        </div>
      </div>
      <button class="sound-control-btn" @click="toggleSound">
        <IconNoMusic v-if="isPlay" />
        <IconMusic v-else />
      </button>
    </div>
    <div class="header">
      <p>{{ timer.text }}</p>
      <div>تعداد حرکت: {{ moveCountAllowed }}</div>
    </div>

    <GameBoard :cards="cards" @select-card="selectCard" />

    <GameResult v-model:show="showModal" :status="status" />

    <button
      v-if="isGameOver"
      class="restart-game-btn"
      @click="restartGame"
    >
      شروع دوباره
    </button>
  </div>
</template>

<style>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 17px;
  font-weight: bold;
}
.game-board {
  display: grid;
  grid-template-columns: repeat(v-bind('getGridDimension.cols'), 80px);
  grid-template-rows: repeat(v-bind('getGridDimension.rows'), 80px);
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  justify-content: center;
}

.restart-game-btn {
  background-color: #CDF0EA;
  border: 0;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  font-weight: 900;
}

.settings {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  .sound-control-btn {
    width: 45px;
    height: 45px;
    border-radius: 100%;
    border: 0;
    padding: 10px;
    background-color: #CDF0EA;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    svg {
      fill: #816caf;
    }
  }
  .levels {
    display: flex;
    .level-item {
      padding: 10px 15px;
      background-color: #CDF0EA;
      margin: 0 2px;
      border-radius: 10px;
      cursor: pointer;
      &.is-active {
        background-color: #816caf;
        color: white;
      }
    }
  }
}

@media (max-width: 425px) {
  .header {
    margin-top: 50px;
  }
  .game-board {
    grid-template-columns: repeat(v-bind('getGridDimension.rows'), 60px);
    grid-template-rows: repeat(v-bind('getGridDimension.cols'), 60px);
  }
}
</style>
