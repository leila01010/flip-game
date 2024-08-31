<script setup>
import Modal from '@/components/ui-kit/Modal.vue'

defineProps({
  status: { type:String, default: '' }
})

const visible = defineModel('show', { default: false })
</script>

<template>
  <Modal v-model:show="visible">
    <div class="game-result">
      <p v-if="status === 'loose'" class="title">شما شکست خوردید</p>
      <p v-else class="title">بازی با موفقیت به پایان رسید</p>
      <button @click="visible = false">متوجه شدم</button>
    </div>
  </Modal>
</template>

<style scoped>
.game-result {
  text-align: center;
  padding: 15px 0;
  .title {
    font-size: 16px;
    margin-bottom: 20px;
  }
  button {
    background-color: #CDF0EA;
    border: 0;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
  }
}
</style>