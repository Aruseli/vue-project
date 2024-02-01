<script setup>
  import CartDrawer from '../components/catalog/cart-drawer.vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  function redirectOnSessionClear() {
    window.addEventListener("beforeunload", function (event) {
      // Cancel the event
      event.preventDefault();
      // Redirect to another page
      router.push("/");
    });
  }

  // const session = sessionStorage.getItem('session');
  // console.log('session', session)
  redirectOnSessionClear();
</script>


<template>
  <q-layout view="hHr lpR fFF">
    <CartDrawer />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

