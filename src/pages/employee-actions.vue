<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { nextTick, onMounted, onBeforeMount, reactive, ref, watch, watchEffect, computed } from 'vue';
  import RectangularButton from '../components/buttons/rectangular-button.vue';
import { useQuasar } from 'quasar';
import { t } from 'i18next';
import { useAppStore } from 'src/stores/app';
import { useSelectInventoryStore } from 'src/stores/selective-inventory';
import RedirectDialog from 'src/components/dialog/redirect-dialog.vue';

  const $q = useQuasar();
  const router = useRouter();
  const _route = useRoute();
  const app = useAppStore();
  const selectInventoryStore = useSelectInventoryStore();
  const dialogState = ref(false);
  const openCatalog = ref(false);
  const invNum = ref(0);

  const sum = computed(() => invNum.value)
  const route = (path) => {
    router.push(path);
  }
  const switcher = async () => {
    console.log('123')
    await app.closingShift();
    router.push('close-shift/complete-inventory');
  }

  const routes = reactive([
    {
      name: !openCatalog.value ? 'open_shift' : 'shift_is_open_switch_to_user_mode',
      path: openCatalog.value ? () => route('open-shift/complete-inventory'): () => route('hello'),
    },
    {
      name: 'close_shift',
      path: () => switcher(),
      disable: app.getShift?.shift?.global_shift_id == app.currentShift ? false : true,
    },
    {
      name: 'issue_order',
      path: () => route('issuing-order'),
    },
    {
      name:'selective_inventory',
      path: () => route('selective-inventory'),
      disable: sum > 0 ? true : false,
      badge: sum > 0 ? false : true,
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

  watchEffect(() => {
    invNum.value;
    routes[3].disable;
    console.log('WATCH', invNum.value)
    console.log('DISABLE', routes[3].disable)
  })

  console.log('invNum', invNum.value)

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
  // onBeforeMount(() => {
  //   selectInventoryStore.updateInventories();
  //   invNum.value = selectInventoryStore.inventories.length;
  // })
  onMounted(async() => {
    console.log('route', _route);
    await app.updateGetShift();
    await app.updateCurrentShift();
    await selectInventoryStore.updateInventories();
    const invDocs = selectInventoryStore.inventoriesDocuments.length;
    openCatalog.value = (app.getShift?.shift?.global_shift_id === app.currentShift);
    if( invDocs > 0 ) {
      dialogState.value = true
      invNum.value = invDocs;
      console.log('IFInvDocsRef', invNum.value);
    }
    // await app.updateStateShift();
    console.log('GET STATUS', app.getShift?.shift?.global_shift_id );
    console.log('CURRENT STATUS', app.currentShift);
    console.log('openCatalog STATUS', openCatalog.value);
    console.log('InvDocs', selectInventoryStore.inventoriesDocuments.length);
    console.log('InvDocsRef', invNum.value);
  })

  const closingShift = () => {
     app.closingShift();
     router.push('complete-inventory')
    //  app.closedShift();
    console.log('CLOSED STATUS', app.closeShift);
  }

  const defer = () => {
    dialogState.value = false;
  }
</script>

<template>
  <q-page class="flex flex-center relative transparent">
    <div class="column justify-center full-height full-width container">
      <RectangularButton
        v-for="(route, index) in routes"
        :key="index"
        :name='$t(route.name)'
        :disable='route.disable == true'
        :class="{ 'blocked': route.disable && route.disable == true }"
        @click="() => {
          route.name == 'arrival_goods'
            ? showNotify()
            : route.name !== 'arrival_goods'
            ? route.path()
            : null
        }"
      >
        <div v-if="route.badge" class="badge_style bg-positive flex items-center">
          <div class="text-h4 text-white q-px-sm">{{ invNum }}</div>
        </div>
      </RectangularButton>

    </div>
    <RedirectDialog
      @complete="defer"
      @continue="route('selective-inventory')"
      :modelValue="dialogState"
      nameLeftButton="defer"
      nameRightButton="execute"
      title="there_are_documents_for_inventory"
    />
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

