<script setup>
  import { useRouter } from 'vue-router';
  import { onMounted, reactive, ref } from 'vue';
  import RectangularButton from '../components/buttons/rectangular-button.vue';
import { useQuasar } from 'quasar';
import { t } from 'i18next';
import { useAppStore } from 'src/stores/app';
import { useSelectInventoryStore } from 'src/stores/selective-inventory';

  const $q = useQuasar();
  const router = useRouter();
  const app = useAppStore();
  const selectInventoryStore = useSelectInventoryStore();
  const route = (path) => {
    router.push(path);
  }

  const routes = reactive([
    {
      name: 'open_shift',
      path: !!app.getShift ? () => route('hello') : () => route('complete-inventory'),
    },
    {
      name: 'close_shift',
      path: () => route(''),
      disable: !app.getShift,
    },
    {
      name: 'issue_order',
      path: () => route('issuing-order'),
    },
    {
      name:'selective_inventory',
      path: () => route('selective-inventory'),
      disable: selectInventoryStore.inventoriesDocuments.length ? false : true,
      badge: selectInventoryStore.inventoriesDocuments.length ? true : false,
    },
    {
      name: 'complete_inventory',
      path: () => route('complete-inventory'),
    },
    {
      name: 'arrival_goods',
      path: () => route('employee-actions'),
    },
    {
      name: 'print_leftovers',
      path: () => route(''),
    },
    {
      name: 'list_active_orders',
      path: () => route(''),
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
  onMounted(async() => {
    await app.updateGetShift();
    await app.updateCurrentShift();
    await selectInventoryStore.updateInventories();
    if (selectInventoryStore.inventoriesDocuments.length) {
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('there_are_documents_for_inventory'),
        timeout: 6000,
      })
    }
    console.log('STATUS', app.getShift);
    console.log('CURRENT', app.currentShift);
    console.log('InvDocs', selectInventoryStore.inventoriesDocuments.length);
  })
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
        :badge="route.badge"
        @click="() => {
          route.name == 'arrival_goods'
            ? showNotify()
            : route.name !== 'arrival_goods'
            ? route.path()
            : null
        }"
      >
        <div v-if="route.badge" class="badge_style bg-positive flex items-center">
          <div class="text-h4 text-white q-px-sm">123</div>
        </div>
      </RectangularButton>

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
.blocked .disabled {
  filter: brightness(0.3);
}

.badge_style {
  position: absolute;
  top: -1rem;
  right: -1rem;
  border-radius: 2.5rem;
  min-width: 3rem;
  width: max-content;
  height: 4.5rem;
}
</style>

