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
  <transition name="lang_drawer_animation">
    <div class="lang_drawer_container bg-white origin-top-center" v-if="props.isOpen">
      <slot></slot>
    </div>
  </transition>
  <transition name="lang_backdrop_animation">
    <div class="lang_drawer_backdrop" v-if="props.isOpen" @click="emit('click')" />
  </transition>
</template>

<style>
.lang_drawer_backdrop {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .5);
  width: 100vw;
  height: 100vh;
  display: flex;
}
.lang_drawer_container {
  z-index: 199;
  position: absolute;
  top: 9rem;
  width: 100%;
  height: calc(100vh - 18rem);
  padding: 2rem;
  border-radius: 2rem;
  box-shadow: var(box-shadow);
  box-sizing: border-box;
  @media (max-width: 800px) {
    padding: 1rem;
    border-radius: 1rem;
  }
}

.lang_drawer_animation-enter-active,
.lang_drawer_animation-leave-active {
  transition: all 0.2s cubic-bezier(0.215, 0.610, 0.355, 1);
  transform-origin: right;
}

.lang_drawer_animation-leave-to,
.lang_drawer_animation-enter-from {
  opacity: 0;
  /* transform: translateY(100%); */
  height: 100%;
}
.lang_backdrop_animation-enter-active {
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
}
.lang_backdrop_animation-leave-active {
  transition: all 0.5s 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.lang_backdrop_animation-leave-to,
.lang_backdrop_animation-enter-from {
  opacity: 0;
}
</style>
