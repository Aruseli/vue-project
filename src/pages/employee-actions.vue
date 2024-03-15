<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { nextTick, onMounted, onBeforeMount, reactive, ref, watch, watchEffect, computed } from 'vue';
  import RectangularButton from '../components/buttons/rectangular-button.vue';
  import { useQuasar } from 'quasar';
  import i18next, { t } from 'i18next';
  import { useAppStore } from 'src/stores/app';
  import { useSelectiveInventoryStore } from 'src/stores/selective-inventory';
  import RedirectDialog from 'src/components/dialog/redirect-dialog.vue';
  import { delay } from 'src/services';
  import { useGoodsStore } from 'src/stores/goods';

  const $q = useQuasar();
  const router = useRouter();
  const app = useAppStore();
  const goodsStore = useGoodsStore();
  const selectiveInventoryStore = useSelectiveInventoryStore();
  const dialogState = ref(false);
  const inventoryRequests = ref(0);

  const route = (path) => {
    router.push(path);
  }

  // {
  //   name: string,
  //   click: async () => undefined,
  //   disable: boolean,
  //   badge: boolean | undefined,
  // }
  const buttons = computed(() => {
    const inventoryOnShiftOpen = app.kioskState.settings?.shifts__inventory_on_open;
    const inventoryOnShiftClose = app.kioskState.settings?.shifts__inventory_on_close;
    const skipInventoryOnOpen = app.kioskState.settings?.shifts__skip_inventory_on_open_if_same_user &&
      app.kioskState.terminalShiftPreviousClosedBy == app.kioskState.user?.id;

    return [
      {
        name: (app.customerModeIsAllowed) ? 'shift_is_open_switch_to_user_mode' : 'open_shift',
        click: async () => {
          if (app.customerModeIsAllowed) {
            route('hello');
            return;
          }
          if (inventoryOnShiftOpen && !skipInventoryOnOpen) {
            route('open-shift/complete-inventory');
          } else {
            await app.openTerminalShift();
            route('hello');
          }
        },
        disable: !app.customerModeIsAllowed && !app.shiftOpenIsAllowed,
      },
      {
        name: 'close_shift',
        click: async () => {
          if (!app.shiftIsClosing) {
            await app.startClosingTerminalShift();
          }
          if (inventoryOnShiftClose) {
            route('close-shift/complete-inventory');
          } else {
            await app.closeTerminalShift();
          }
        },
        disable: !app.shiftCloseIsAllowed,
      },
      {
        name: 'issue_order',
        click: () => route('issuing-order'),
        disable: !app.orderIssueIsAllowed,
      },
      {
        name:'selective_inventory',
        click: () => route('selective-inventory'),
        // TODO rights__kiosk_selective_inventory_extended
        disable: inventoryRequests.value > 0 ? !app.shiftIsGood || !app.hasRight(app.kioskState.settings?.rights__kiosk_selective_inventory) : true,
        badge: inventoryRequests.value > 0 ? true : false,
      },
      {
        name: 'complete_inventory',
        click: () => route('complete-inventory'),
        disable: !app.shiftIsGood || !app.hasRight(app.kioskState.settings?.rights__kiosk_full_inventory),
      },
      {
        name: 'arrival_goods',
        click: async () => {
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
        },
        disable: !app.arrivalsAreAllowed,
      },
      {
        name: 'print_leftovers',
        // TODO print_leftovers
        click: () => route(''),
        disable: true || !app.shiftIsGood || !app.hasRight(app.kioskState.settings?.rights__kiosk_print_stock),
      },
      {
        name: 'list_active_orders',
        // TODO list_active_orders
        click: () => route(''),
        disable: true || !app.shiftIsGood || !app.hasRight(app.kioskState.settings?.rights__kiosk_list_orders),
      },
    ];
  });

  onMounted(async() => {
    if (app.kioskState.status != 'Ready') {
      // Hack for page reloads
      await delay(1000);
    }
    if (app.kioskState.status == 'Ready' && goodsStore.imagesCacheExpirationAt < Date.now()) {
      goodsStore.updateGoods(i18next.language); // Don't await intentionally
    }
    await app.updateShifts();
    await selectiveInventoryStore.updateInventories();
    inventoryRequests.value = selectiveInventoryStore.inventoriesDocuments.length;
    if( inventoryRequests.value > 0 ) {
      dialogState.value = true;
    }
  })

  // const defer = () => {
  //   dialogState.value = false;
  // }
</script>

<template>
  <q-page class="flex flex-center relative transparent">
    <div class="column justify-center full-height full-width container">
      <RectangularButton
        v-for="(button, index) in buttons"
        :key="index"
        :name='$t(button.name)'
        :disable='button.disable'
        :class="{ 'blocked': button.disable }"
        @click="button.click"
      >
        <div v-if="button.badge == true" class="badge_style bg-positive flex items-center">
          <div class="text-h4 text-white q-px-sm">{{ inventoryRequests }}</div>
        </div>
      </RectangularButton>

    </div>
    <RedirectDialog
      @complete="dialogState = false"
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

