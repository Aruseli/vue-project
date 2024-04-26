<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default:false,
  },
  to: {
    type: String,
    required: false,
    default: "#modal"
  },
})

const emit = defineEmits(['click']);

</script>

<template>
  <teleport :to="props.to">
    <transition name="teleport-modal-animation">
      <div class="flex items-center justify-center window-width full-height" v-if="props.isOpen">
        <div
          class="dialog_style overflow-hidden q-pa-md-xl q-pa-xs-md"
          role="dialog"
          aria-modal="true"
          v-bind="$attrs"
        >
          <slot></slot>
        </div>
        <div class="modal_bg" @click="emit('click')">
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal_bg {
  z-index: 9998;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(24, 24, 24, .30);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(7px);
}

.dialog_style {
  border-radius: 2rem;
  position: absolute;
  z-index: 9999;
}

.teleport-modal-animation-enter-active,
.teleport-modal-animation-leave-active {
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.teleport-modal-animation-leave-to,
.teleport-modal-animation-enter-from {
  opacity: 0;
  transform: scale(1.1);
}

</style>
