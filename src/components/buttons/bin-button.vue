<script setup>
  const props = defineProps({
    openDrawer: Function,
    class: String
  })
</script>

<template>
  <q-btn unelevated round @click="openDrawer">
    <q-icon :class='class'>
      <BinButton />
    </q-icon>
  </q-btn>
</template>
