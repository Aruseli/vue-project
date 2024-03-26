<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default:false,
  }
})

const emit = defineEmits(['click']);
const click = () => {
  emit('click')
}
</script>

<template>
  <teleport to="#modal">
    <transition name="modal-animation">
        <div class="modal_bg" v-if="props.isOpen">
          <div
            class="dialog_style overflow-hidden q-pa-md-md q-pa-xs-sm bg-white"
            role="dialog"
            aria-modal="true"
          >
            <slot></slot>
          </div>
        </div>
      </transition>
  </teleport>
</template>

<style>
  .modal_bg {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog_style {
    border-radius: 2rem;
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
