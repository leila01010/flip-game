<script setup>
import Card from '@/components/Card.vue'

defineProps({
  cards: { type: Array, default: () => [] }
})

const emit = defineEmits(['select-card'])

const selectCard = (card) => {
  emit('select-card', card)
}
</script>

<template>
  <div class="game-board">
    <Card
      v-for="(card, i) in cards"
      :key="i"
      :index="card.index"
      :value="card.value"
      :visible="card.visible"
      :matched="card.matched"
      @select="selectCard"
    />
  </div>
</template>