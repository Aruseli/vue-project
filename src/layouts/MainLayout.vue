<script setup>
  import CartDrawer from '../components/catalog/cart/cart-drawer.vue';
</script>


<template>
  <q-layout view="hHr lpR fFF">
    <CartDrawer />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

