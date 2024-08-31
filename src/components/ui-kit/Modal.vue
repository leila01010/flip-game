<script setup>
const visible = defineModel('show', { default: false })
</script>

<template>
  <Teleport to="body">
    <div v-show="visible" class="modal">
      <transition name="modal">
        <div v-show="visible" class="modal-content">
          <slot />
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 400px;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-leave-to {
  transform: scale(0.8);
}
</style>