<script setup>
  import BinIcon from './buttons/bin-icon.vue';
  import Switcher from './switcher.vue';
  import { ref } from 'vue';
  import { productsStore } from 'src/stores/store';
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n({ useScope: 'global' })

// Function to switch language
  const switchLanguage = (newLocale) => {
    locale.value = newLocale
  }

  const tab = ref('stuff');
  const store = productsStore();

  const openDrawer = () => {
    store.openDrawer(true);
  }

</script>


<template>
  <q-header
    reveal
    reveal-offset="100"
    class="header"
  >
    <q-toolbar class="justify-end">
      <q-btn unelevated round @click="openDrawer">
        <q-icon class="round-button-light_green">
          <BinIcon />
          <q-badge align="bottom" round>{{ store.cart.length }}</q-badge>
        </q-icon>
      </q-btn>
      <Switcher />
      <div>
        <q-btn
          label="English"
          @click="switchLanguage('en-US')"
        />
        <q-btn
          label="German"
          @click="switchLanguage('de-DE')"
        />
      </div>
    </q-toolbar>

    <q-tabs
      v-model="tab"
      inline-label
      narrow-indicator
      no-caps
    >
      <q-tab name="stuff" label="Images" />
      <q-tab name="stuff" label="Videos" />
      <q-tab name="stuff" label="Articles" />
      <q-tab name="stuff" label="Images" />
      <q-tab name="stuff" label="Videos" />
      <q-tab name="stuff" label="Articles" />
    </q-tabs>
  </q-header>
</template>

<style scoped>
.header {
  color: var(--q-text);
  background-color: var(--q-header_bg);
  padding-bottom: 1rem;
}
</style>
