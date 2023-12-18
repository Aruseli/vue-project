<script setup>
  import BinIcon from './buttons/bin-icon.vue';
  import Switcher from './switcher.vue';
  import { ref } from 'vue';
  import { productsStore } from 'src/stores/store';
  import { useI18n } from 'vue-i18n';
  import BinButton from './buttons/bin-button.vue';

  const { locale } = useI18n({ useScope: 'global' });
  const { t } = useI18n();

// Function to switch language
  const switchLanguage = (newLocale) => {
    locale.value = newLocale
  }

  // const tab = ref('stuff');
  const store = productsStore();

  const openDrawer = () => {
    store.openDrawerCart(true);
  }

</script>


<template>
  <q-header
    reveal
    reveal-offset="100"
    class="header"
  >
    <q-toolbar class="justify-end">
      <Switcher />
      <div>
        <q-btn
          label="En"
          @click="switchLanguage('en-US')"
        />
        <q-btn
          label="Gr"
          @click="switchLanguage('de-DE')"
        />
      </div>
    </q-toolbar>

    <div class="relative-position">
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
      <q-btn unelevated round class="absolute-right q-mr-lg" @click="openDrawer">
        <q-icon class="round-button-light_green">
          <BinIcon />
          <q-badge align="bottom" round>{{ store.cart.length }}</q-badge>
        </q-icon>
      </q-btn>
      <!-- <bin-button /> -->
    </div>
  </q-header>
</template>

<style scoped>
.header {
  color: var(--q-text);
  background-color: var(--q-header_bg);
  padding-bottom: 1rem;
}
</style>
