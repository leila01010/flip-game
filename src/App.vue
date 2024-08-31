<script setup>
import GameBoard from '@/components/GameBoard.vue'
import GameResult from '@/components/GameResult.vue'

import { computed, ref, watch } from 'vue'

import { useTimer } from '@/composables/timer.js'

import { shuffle } from '@/modules/utils.js'

const { timer, startTimer, stopTimer, initTimer } = useTimer()

const levels = [
  {
    title: 'easy',
    count: 12,
    time: 3000,
    move: 20
  },
  {
    title: 'normal',
    count: 16,
    time: 2000,
    move: 20
  },
  {
    title: 'hard',
    count: 32,
    time: 2000,
    move: 20
  }
]

const level = ref('normal')

const cards = ref([])

const selections = ref([])

const started = ref(false)

const showModal = ref(false)

const moveCountAllowed = ref(0)

const selectedLevel = computed(() => {
  return levels.find(item => item.title === level.value)
})

const getGridDimension = computed(() => {
  const ROWS = 4
  return {
    rows: ROWS,
    cols: selectedLevel.value.count / ROWS
  }
})

const matchesFound = computed(() => {
  const matchedCards = cards.value.filter(card => card.matched === true).length

  return matchedCards / 2
})

const status = computed(() => {
  if (moveCountAllowed.value === 0 && matchesFound.value !== cards.value.length / 2
    || timer.status === 'end') return 'loose'
  else if (matchesFound.value === cards.value.length / 2) return 'win'
  else return ''
})

const isGameOver = computed(() => {
  return !!status.value
})

watch(selectedLevel, currentValue => {
  if (currentValue) moveCountAllowed.value = currentValue.move
}, { immediate: true })

watch(isGameOver, currentValue => {
  if (currentValue) {
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

const createBoard = () => {
  const pairsCount = selectedLevel.value.count / 2

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

const selectCard = (card) => {
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

const startGame = () => {
  if (!started.value) startTimer()

  started.value = true
}

const restartGame = () => {
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

const shuffleCards = () => {
  cards.value = shuffle(cards.value)

  cards.value = cards.value.map((card, index) => {
    return {
      ...card,
      index: index,
    }
  })
}

createBoard()
initTimer()
</script>

<template>
  <div class="flip-game">
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
  background-color: #29ce4e;
  border: 0;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  font-weight: 900;
  color: white;
    font-family: inherit;
  }
}
</style>
