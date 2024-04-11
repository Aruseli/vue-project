<script setup>
import { useAppStore } from '../stores/app.ts';
const app = useAppStore();

</script>

<template>
  <q-layout :view="app.kioskState.settings?.alt_ui == 'design_v1' ? 'hHr lpR fFf' : 'hHh lpR fFf'">
    <q-page-container :style="[app.kioskState.settings?.alt_ui == 'design_v1' ? 'padding-top: 110px' : 'padding-top: 0px']">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

