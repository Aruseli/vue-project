<script setup>
  import CartDrawer from '../components/cart-catalog/cart-drawer.vue';

</script>


<template>
  <q-layout view="hHr lpR fFF">
    <CartDrawer />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

