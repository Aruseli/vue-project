<script setup>
import { useAppStore } from '../stores/app.ts';
const app = useAppStore();

</script>

<template>
  <q-layout :view="app.kioskState.settings?.alt_ui == 'design_v3' ? 'hHh lpR fFf' : 'hHr lpR fFf'">
    <q-page-container :style="[app.kioskState.settings?.alt_ui == 'design_v3' ? 'padding-top: 0px' : 'padding-top: 110px']">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

