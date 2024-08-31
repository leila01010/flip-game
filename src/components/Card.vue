<script setup>
const props = defineProps({
  index: { type: Number, default: null },
  value: { type: Number, default: null },
  visible: { type: Boolean, default: false },
  matched: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])

const select = () => {
  emit('select', {
    index: props.index,
    value: props.value
  })
}
</script>

<template>
  <div class="card" :class="{ 'is-flipped': visible }" @click="select">
    <div class="card-view is-front">
      <img :src="`/images/product-${value + 1}.jpg`" :alt="`product-${value}`" />
    </div>
    <div class="card-view is-back">?</div>
  </div>
</template>

<style>
.card {
  position: relative;
  transition: 0.5s transform ease-in;
  transform-style: preserve-3d;
}

.card.is-flipped {
  transform: rotateX(180deg);
}

.card-view {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  cursor: pointer;
  box-shadow: 4px 4px 0 #F7DBF0;
  img {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
}

.card-view.is-front {
  transform: rotateX(180deg);
  background-color: #e8e1c9;
}

.card-view.is-back {
  background-color: #BEAEE2;
  color: #F7DBF0;
  font-weight: bold;
  font-size: 25px;
}

</style>