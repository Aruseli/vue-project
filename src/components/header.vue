<script setup>
  import BinIcon from './buttons/bin-icon.vue';
  import Switcher from './switcher.vue';
  import { ref } from 'vue';
  import { productsStore } from 'src/stores/store';
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n({ useScope: 'global' });
  const { t } = useI18n();

// Function to switch language
  const switchLanguage = (newLocale) => {
    locale.value = newLocale
  }

  // const tab = ref('stuff');
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
      v-model="store.tab"
      inline-label
      no-caps
      indicator-color="transparent"
      active-color="white"
    >
      <q-tab name="food" :label="t('food')" />
      <q-tab name="roll_sets" :label="t('roll_sets')" />
      <q-tab name="weight_sets" :label="t('weight_sets')" />
      <q-tab name="consumption_sets" :label="t('consumption_sets')" />
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
