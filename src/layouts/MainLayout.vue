<script setup>
import { useAppStore } from '../stores/app.ts';
const app = useAppStore();

if (app.kioskState.settings?.alt_ui == 'design_v3') {
  document.body.className = 'v3_body_style'
}
console.log('FUCKING_FONTS', app.kioskState.settings?.alt_ui)

</script>

<template>
  <q-layout :view="app.kioskState.settings?.alt_ui == 'design_v1' ? 'hHr lpR fFf' : 'hHh lpR fFf'">
    <q-page-container :style="[app.kioskState.settings?.alt_ui == 'design_v1' ? 'padding-top: 110px' : 'padding-top: 0px']">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.v3_body_style {
  font-family: 'Poppins, sans-serif';
}
</style>

