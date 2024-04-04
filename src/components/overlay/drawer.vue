<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default:false,
  }
})

const emit = defineEmits(['click']);
</script>

<template>
  <teleport to="#drawer">

    <transition name="drawer_animation">
      <div class="drawer_container bg-white" v-if="props.isOpen">
        <slot></slot>
      </div>
    </transition>
    <transition name="backdrop_animation">
      <div class="drawer_backdrop" v-if="props.isOpen" @click="emit('click')" />
    </transition>
  </teleport>
</template>

<style>
.drawer_backdrop {
  z-index: 99;
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
.drawer_container {
  z-index: 199;
  position: absolute;
  right: 0.5rem; top: 0.5rem;
  max-width: 80vw;
  min-width: 50vw;
  width: 65vw;
  height: calc(100vh - 1rem);
  padding: 2rem;
  border-radius: 2rem;
  box-shadow: var(box-shadow);
  box-sizing: border-box;
}

.drawer_animation-enter-active,
.drawer_animation-leave-active {
  transition: all 0.2s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.drawer_animation-leave-to,
.drawer_animation-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.backdrop_animation-enter-active {
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
}
.backdrop_animation-leave-active {
  transition: all 0.5s 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.backdrop_animation-leave-to,
.backdrop_animation-enter-from {
  opacity: 0;
}
</style>
