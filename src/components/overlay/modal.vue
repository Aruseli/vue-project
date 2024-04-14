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
  isOpen: {
    type: Boolean,
    required: true,
    default:false,
  }
})

const emit = defineEmits(['click']);

</script>

<template>
  <teleport :to="props.to">
    <transition name="modal-animation">
      <div class="flex items-center justify-center window-width full-height" v-show="props.isOpen">
        <div
          class="dialog_style overflow-hidden q-pa-md-xl q-pa-xs-md"
          role="dialog"
          aria-modal="true"
          v-bind="$attrs"
        >
          <slot></slot>
        </div>
        <div class="modal_bg" v-if="props.isOpen" @click="emit('click')">
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style>
.modal_bg {
  z-index: 9998;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .65);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog_style {
  border-radius: 2rem;
  position: absolute;
  z-index: 9999;
}

.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.modal-animation-leave-to,
.modal-animation-enter-from {
  opacity: 0;
  transform: scale(1.1);
}

</style>
