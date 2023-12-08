<script setup>
  import { useQuasar } from 'quasar';
  import { ref } from 'vue';
  import { evaMoonOutline } from '@quasar/extras/eva-icons';
  import { evaSunOutline } from '@quasar/extras/eva-icons';

  const toggleDark = useQuasar();

  const isActiveDarkMode = ref(toggleDark.dark.isActive);
  function toggleDarkMode () {
    toggleDark.dark.toggle();
  }

</script>

<template>
  <q-toggle
    v-model="isActiveDarkMode"
    @update:model-value="toggleDarkMode(isActiveDarkMode)"
    :icon="evaMoonOutline"
    :unchecked-icon="evaSunOutline"
    color="primary"

  />
</template>
