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