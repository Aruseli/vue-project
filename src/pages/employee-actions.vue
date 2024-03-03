<script setup>
  import { useRouter } from 'vue-router';
  import { computed, reactive, ref } from 'vue';
  import RectangularButton from '../components/buttons/rectangular-button.vue';
  import { useQuasar } from 'quasar';
  import { t } from 'i18next';
  import { useAppStore } from 'src/stores/app';

  const $q = useQuasar();
  const router = useRouter();
  const appStore = useAppStore();
  const route = (path) => {
    router.push(path);
  }

  const routes = reactive([
    {
      name: 'open_shift',
      path: () => route('hello'),
      disable: computed(() => !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_open_shift_right_id)),
    },
    {
      name: 'close_shift',
      path: () => route(''),
      // TODO: Analize shift
      disable: computed(() => !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_close_own_shift_right_id) &&
                              !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_close_shift_right_id)),
    },
    {
      name: 'issue_order',
      path: () => route('issuing-order'),
      disable: computed(() => !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_issue_order_right_id)),
    },
    {
      name:'selective_inventory',
      path: () => route('selective-inventory'),
      // TODO: Merge with appStore
      disable: computed(() => !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_selective_inventory_right_id) &&
                              !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_selective_inventory_extended_right_id)),
    },
    {
      name: 'complete_inventory',
      path: () => route('complete-inventory'),
      disable: computed(() => !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_full_inventory_right_id)),
    },
    {
      name: 'arrival_goods',
      path: () => route('employee-actions'),
      disable: computed(() => !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_arrival_of_goods_right_id)),
    },
    {
      name: 'print_leftovers',
      path: () => route(''),
      disable: computed(() => !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_print_stock_right_id)),
    },
    {
      name: 'list_active_orders',
      path: () => route(''),
      disable: computed(() => !appStore.kioskState.user?.rights.some(r => r.id == appStore.kioskState.settings.kiosk_list_orders_right_id)),
    },
  ])

  const showNotify = () => {
    $q.notify({
      position: "center",
      color: "positive",
      classes: "full-width warning_customization",
      timeout: 1000,
      icon: 'img:/barcode_scanner.svg',
      iconSize: '5rem',
      spinnerSize: '3rem',
      actions: [
        {
          icon: "cancel",
          'aria-label': 'cancel',
          label: t("scan_the_barcode_of_the_document"),
          color: "white",
          round: true,
        },
      ],
    });
  }

</script>

<template>
  <q-page class="flex flex-center relative transparent">
    <div class="column justify-center full-height full-width container">
      <RectangularButton
        v-for="(route, index) in routes"
        :key="index"
        :name='$t(route.name)'
        :disable='route.disable'
        :class="{ 'blocked': route.disable }"
        @click="() => {
          route.name == 'arrival_goods'
            ? showNotify()
            : route.name !== 'arrival_goods'
            ? route.path()
            : null
        }"
      />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 5rem;
}
.container > *:not(:last-child) {
  margin-bottom: 2rem;
}
.blocked {
  filter: brightness(0.3);
}
</style>

