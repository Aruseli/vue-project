<script setup>
  import SelectiveInventory from '../components/inventory/selective-inventory.vue';

</script>

<template>
  <q-page class="flex flex-center relative bg-white">
    <div class="column justify-center items-center window-height full-width container">
      <SelectiveInventory />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 1rem 3.75rem 3.75rem 3.75rem;
}
</style>
