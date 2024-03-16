<script setup>
  import ArrivalGoods from '../components/arrival/arrival-goods.vue';

</script>

<template>
  <q-page class="flex flex-center relative bg-white">
    <div class="column justify-center items-center window-height full-width container">
      <ArrivalGoods />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 3.75rem;
  @media (min-width: 900px) {
    padding: 1.5rem;
  }
  @media (max-width: 899px) {
    padding: 0.5rem;
  }
}
</style>
