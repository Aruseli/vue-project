<script setup>
const props = ({
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
  <teleport to="body">
    <div class="modal" @click="click">
      <slot></slot>
    </div>
  </teleport>
</template>

<style scoped>
  .modal {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
