<script setup>
  import CompleteInventory from '../components/inventory/complete-inventory.vue';

</script>

<template>
  <q-page class="flex flex-center relative bg-white">
    <div class="column justify-center items-center window-height full-width container">
      <CompleteInventory />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 3.75rem;
}
</style>
